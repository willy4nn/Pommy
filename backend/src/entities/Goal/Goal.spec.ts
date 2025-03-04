import { Goal } from "./Goal";

describe("Goal Entity Unit Tests", () => {
	it("should create a goal with default values when optional parameters are not provided", () => {
		// Setup goal properties
		const props = {
			user_id: "40fec15d-8556-4245-9902-694dd047b3b2",
			title: "First Goal",
			description: "This is the description of the first goal.",
		};

		// Regex to validate UUIDv4
		const uuidv4Regex =
			/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

		// Create a new Goal instance without providing id, createdAt, and updatedAt
		const goal = new Goal(props);

		// Validate that properties are correctly assigned
		expect(goal.title).toBe(props.title);
		expect(goal.description).toBe(props.description);
		expect(goal.user_id).toBe(props.user_id);
		expect(goal.id).toMatch(uuidv4Regex);
		expect(goal.createdAt).toBeInstanceOf(Date);
		expect(goal.updatedAt).toBeInstanceOf(Date);
	});

	it("should use provided id, createdAt, and updatedAt values when given", () => {
		// Setup goal properties
		const props = {
			user_id: "40fec15d-8556-4245-9902-694dd047b7b7",
			title: "First Goal",
			description: "This is the description of the first goal.",
		};

		// Custom values for id and dates
		const customId = "fc946765-f3a1-4270-b2f9-a64b0fde58bb";
		const customCreatedAt = new Date("2025-03-01T00:00:00Z");
		const customUpdatedAt = new Date("2025-03-02T00:00:00Z");

		// Create a new Goal instance using custom values
		const goal = new Goal(
			props,
			customId,
			customCreatedAt,
			customUpdatedAt
		);

		// Validate that custom values are used
		expect(goal.id).toBe(customId);
		expect(goal.createdAt).toBe(customCreatedAt);
		expect(goal.updatedAt).toBe(customUpdatedAt);
	});
});
