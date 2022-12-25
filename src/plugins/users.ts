import Hapi from "@hapi/hapi";
import boom from "@hapi/boom";
import Joi from "@hapi/joi";

const usersPlugin: Hapi.Plugin<undefined> = {
	name: "app/users",
	dependencies: ["prisma"],
	register: async function (server: Hapi.Server) {
		server.route([
			{
				method: "POST",
				path: "/users",
				handler: createUserHandler,
				options: {
					validate: {
						payload: userInputValidator,
						failAction: (request, h, err) => {
							throw err;
						},
					},
				},
			},
			{
				method: "GET",
				path: "/users/{userId}",
				handler: getUserHandler,
				options: {
					validate: {
						params: Joi.object({
							userId: Joi.string().pattern(/^[0-9]+$/),
						}),
						failAction: (request, h, err) => {
							throw err;
						},
					},
				},
			},
			{
				method: "DELETE",
				path: "/users/{userId}",
				handler: deleteUserHandler,
				options: {
					validate: {
						params: Joi.object({
							userId: Joi.string().pattern(/^[0-9]+$/),
						}),
						failAction: (request, h, err) => {
							throw err;
						},
					},
				},
			},
		]);
	},
};

export default usersPlugin;

interface UserInput {
	firstName: string;
	lastName: string;
	email: string;
	social: {
		facebook?: string;
		twitter?: string;
		github?: string;
		website?: string;
		tiktok?: string;
	};
}

const userInputValidator = Joi.object({
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	email: Joi.string().email().required(),
	social: Joi.object({
		facebook: Joi.string().optional(),
		twitter: Joi.string().optional(),
		github: Joi.string().optional(),
		website: Joi.string().uri().optional(),
		tiktok: Joi.string().optional(),
	}),
});

async function createUserHandler(
	request: Hapi.Request,
	h: Hapi.ResponseToolkit
) {
	const { prisma } = request.server.app;
	const payload = request.payload as UserInput;
	try {
		const createdUser = await prisma.user.create({
			data: {
				email: payload.email,
				firstName: payload.firstName,
				lastName: payload.lastName,
				social: payload.social,
			},
		});
		return h.response({ id: createdUser.id }).code(201);
	} catch (err) {
		console.log(err);
		return boom.badImplementation("Error creating user");
	}
}

async function getUserHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
	const { prisma } = request.server.app;
	const userId = request.params.userId as string;

	const user = await prisma.user.findMany({
		where: {
			id: parseInt(userId, 10),
		},
	});

	if (!user) {
		return boom.notFound("User not found");
	} else {
		return h.response(user).code(200);
	}
}

async function deleteUserHandler(
	request: Hapi.Request,
	h: Hapi.ResponseToolkit
) {
	const { prisma } = request.server.app;
	const userId = request.params.userId as string;

	try {
		await prisma.user.delete({
			where: {
				id: parseInt(userId, 10),
			},
		});
		return h.response().code(204);
	} catch (err) {
		return boom.badImplementation("failed to delete user");
	}
}
