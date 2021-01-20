import {canModifyContainer} from '../utils';
import { USER_TYPE, ORG_TYPE } from "../../../utils";

describe('canModifyContainer', () => {
    const profile: any = {
        username: 'Foo'
    };

    const usersOrgs: any = {
        id: 'Foo'
    };

    it('should return true, when owner type is user and profile username matches owner name', () => {
        expect(canModifyContainer(
            USER_TYPE,
            "Foo",
            profile,
            []
        )).toBe(true);
    });

    it('should return false, when owner type is user and profile username doesn`t matches owner name', () => {
        expect(canModifyContainer(
            USER_TYPE,
            "Foo1",
            profile,
            []
        )).toBe(false);
    });

    it('should return true, when owner type is org and current signed in user is part of that org', () => {
        expect(canModifyContainer(
            ORG_TYPE,
            "Foo",
            profile,
            [usersOrgs]
        )).toBe(true);
    });

    it('should return false, when owner type is org and current signed in user is part of that org', () => {
        expect(canModifyContainer(
            ORG_TYPE,
            "Foo1",
            profile,
            [usersOrgs]
        )).toBe(false);
    });
});
