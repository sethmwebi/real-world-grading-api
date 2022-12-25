import Hapi from "@hapi/hapi"
import { createServer } from "../src/server"

describe("POST /users - create user", () => {
	let server: Hapi.Server;

	beforeAll(async () => {
		server = await createServer()
	})

	afterAll(async () => {
		await server.stop()
	})

	let userId: number;

	test("create user", async () => {
		const response = await server.inject({
			method: "POST",
			url: "/users",
			payload: {
				firstName: "test-first-name",
				lastName: "test-last-name",
				email: `test-${Date.now()}@prisma.io`,
				social: {
					twitter: 'thisisangel',
					website: 'https://www.thisisangel.com'
				}
			}
		})

		expect(response.statusCode).toEqual(201)
		userId = JSON.parse(response.payload)?.id;
		expect(userId).toBeTruthy()
	})

	test("create user fails with invalid input", async () => {
		const response = await server.inject({
			method: "POST",
			url: "/users",
			payload: {
				email: `test-${Date.now()}@prisma.io`,
				social: {
					twitter: 'thisisangel',
					website: 'https://www.thisisangel.com'
				}
			}
		})

		expect(response.statusCode).toEqual(400)
	})

	test("get user returns 404 for non existent user", async () => {

	})

	test("get user returns user", async () => {

	})

	test("get user fails with invalid id", async () => {

	})

	test("delete user", async () => {
		const response = await server.inject({
			method: "DELETE",
			url: `/users/${userId}`
		})

		expect(response.statusCode).toEqual(204)
	})
})