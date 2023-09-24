import logger from '$lib/logger.server';

type ID = string;

type Message = {
	role: 'user' | 'system';
	content: string;
};
type Conversation = {
	id: ID;
	name: string;
	messages: Message[];
};
type Group = {
	id: ID;
	name: string;
	systemPrompt: string;
	conversations: Conversation[];
};

type PartialGroupWithoutId = Partial<Omit<Group, 'id'>>;
type Database = Map<ID, Group>;

export class GroupRepository {
	constructor(private readonly database: Database) {}

	async get(id: ID): Promise<Group | undefined> {
		logger.debug(`Getting group ${id}`);
		return this.database.get(id);
	}

	async list(): Promise<Group[]> {
		logger.debug(`Listing groups`);
		return Array.from(this.database.values());
	}

	async update(id: ID, group: PartialGroupWithoutId): Promise<Group> {
		logger.debug(`Updating group ${id}`);
		const existingGroup = await this.get(id);
		if (existingGroup === undefined) {
			throw new Error(`Group ${id} not found`);
		}

		const updatedGroup = { ...existingGroup, ...group };
		this.database.set(id, updatedGroup);

		return updatedGroup;
	}

	async put(group: Group): Promise<Group> {
		logger.debug(`Putting group ${group.id}`);
		this.database.set(group.id, group);
		return group;
	}
}

const db = new Map();

export default new GroupRepository(db);
