import { randomString } from '../constants';

export default class Person {
  constructor() {
    this.id;
    this.firstName = `F${randomString(7)}`;
    this.lastName = `L${randomString(7)}`;
    this.email = `e-${randomString(9)}@automationrhapsody.com`;
  }
}
