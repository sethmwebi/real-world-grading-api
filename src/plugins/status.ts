import Hapi from "@hapi/hapi";
import boom from "@hapi/boom"

const plugin: Hapi.Plugin<undefined> = {
	name: "app/status",
	register: async function (server: Hapi.Server) {
		server.route({
			method: "GET",
			path: "/",
			handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
				return h.response({ up: true }).code(200);
			},
		});
	},
};

export default plugin;
