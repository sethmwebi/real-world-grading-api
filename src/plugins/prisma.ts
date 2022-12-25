import Hapi from "@hapi/hapi"
import { PrismaClient } from "@prisma/client"

declare module "@hapi/hapi" {
	interface ServerApplicationState {
		prisma: PrismaClient
	}
}

const prismaPlugin: Hapi.Plugin<undefined> = {
	name: 'prisma',
	register: async function(server: Hapi.Server){
		const prisma = new PrismaClient()
		server.app.prisma = prisma;

		server.ext({
			type: "onPreStop",
			method: async (server: Hapi.Server) => {
				server.app.prisma.$disconnect()
			}
		})
	}
}

export default prismaPlugin;