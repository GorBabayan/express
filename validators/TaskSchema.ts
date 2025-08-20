import Joi, { ObjectSchema } from 'joi';

const createTaskSchema = Joi.object({
    title: Joi.string().min(1).required(),
    projectId: Joi.string().uuid().required(),
    assignedToId: Joi.string().uuid().required(),
    status: Joi.string().valid("todo", "in_progress", "done").default("todo"),
    dueDate: Joi.date().optional(),
});

const getProjectTasksSchema = Joi.object({
    projectId: Joi.string().uuid().required(),
    status: Joi.string().valid("todo", "in_progress", "done").default("todo"),
    dueBefore: Joi.date().optional(),
    dueAfter: Joi.date().optional(),
});

const getTaskDetailSchema = Joi.object({
    taskId: Joi.string().uuid().required(),
});

const taskReassignSchema = Joi.object({
    taskId: Joi.string().uuid().required(),
    assignedToId: Joi.string().uuid().required(),
});

export { 
    createTaskSchema, 
    getProjectTasksSchema, 
    getTaskDetailSchema, 
    taskReassignSchema 
};