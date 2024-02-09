import { v4 as uuidv4 } from 'uuid';

class UUIDHelpers {
    static getDefaultUUID(): string {
        return '00000000-0000-0000-0000-000000000000';
    }

    static generateUUID(): string {
        return uuidv4();
    }
}

export default UUIDHelpers;
