import DatabaseConnection from '@database/DatabaseConnection';
import { PrismaClient } from '@prisma/client';

const JobService = (database: PrismaClient) => {

  const getJobs = async () => {
    return await database.job.findMany({
      include: {
        job_category: true,
        department: true
      },
      orderBy: [
        {
          department_id: 'asc'
        },
        {
          job_id: 'asc'
        }
      ]
    });
  };

  const getJob = async (jobId) => {
    return await database.job.findUnique({
      where: {
        job_id: jobId
      },
      include: {
        job_category: true,
        department: true,
        concepto_job: {
          include: {
            concepto: true
          }
        }
      }
    });
  };

  const createJob = async (job) => {
    console.log('Creating job', job);
    try {
      return await database.job.create({
        data: {
          name: job.name,
          base_salary: Number.parseFloat(job.base_salary),
          description: job.description,
          concepto_job: {
            create: job.concepts.map((cid) => {
              return {
                concepto: {
                  connect: {
                    concepto_id: Number.parseInt(cid, 10)
                  }
                }
              };
            })
          },
          department: {
            connect: {
              department_id: Number.parseInt(job.department_id, 10)
            }
          },
          job_category: {
            create: job.categories.map((cat) => {
              return {
                name: cat.name,
                percentage_raise: Number.parseFloat(cat.percentage_raise),
                fixed_raise: Number.parseFloat(cat.fixed_raise)
              };
            })
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const updateJob = async (jobId, job) => {
    console.log('Updating job', jobId, job);
    try {

      const exists = await database.job.findUnique({
        where: {
          job_id: jobId
        }
      });

      if (!exists) {
        throw new Error('Job not found');
      }

      const updateJob = database.job.update({
        where: {
          job_id: jobId
        },
        data: {
          name: job.name,
          base_salary: Number.parseFloat(job.base_salary),
          description: job.description,
          department: {
            connect: {
              department_id: Number.parseInt(job.department_id, 10)
            }
          },
        }
      });
      const deleteConcepts = database.concepto_job.deleteMany({
        where: {
          job_id: jobId
        }
      });
      const createConcepts = database.concepto_job.createMany({
        data: job.concepts.map((cid) => {
          return {
            job_id: jobId,
            concepto_id: Number.parseInt(cid, 10)
          };
        })
      });
      const upsertJobCategories = job.categories.map((cat) => {
        return database.job_category.upsert({
          where: {
            job_category_id: cat.job_category_id ? cat.job_category_id : -1
          },
          create: {
            name: cat.name,
            percentage_raise: Number.parseFloat(cat.percentage_raise),
            fixed_raise: Number.parseFloat(cat.fixed_raise),
            job: {
              connect: {
                job_id: jobId
              }
            }
          },
          update: {
            name: cat.name,
            percentage_raise: Number.parseFloat(cat.percentage_raise),
            fixed_raise: Number.parseFloat(cat.fixed_raise),
            job: {
              connect: {
                job_id: jobId
              }
            }
          }
        });
      });
      await database.$transaction([updateJob, deleteConcepts, createConcepts, ...upsertJobCategories]);
    } catch (err) {
      console.log(err);
    }
  };

  return {
    getJobs,
    getJob,
    createJob,
    updateJob
  };

};

export default JobService(DatabaseConnection.getConnection());
