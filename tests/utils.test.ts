import * as utils from '../utils';
import * as contactUtils from '../utils/contact';

describe('Utils', () => {
  it('utils exports functions', () => {
    expect(utils.cleanLeadData).toBeInstanceOf(Function);
    expect(utils.cleanLeadsData).toBeInstanceOf(Function);
    expect(utils.getGreeting).toBeInstanceOf(Function);
  });
  it('contact utils exports functions', () => {
    expect(contactUtils.callPhoneNumber).toBeInstanceOf(Function);
    expect(contactUtils.sendText).toBeInstanceOf(Function);
    expect(contactUtils.composeEmail).toBeInstanceOf(Function);
  });
  it('getGreeting returns expected greeting', () => {
    const greeting = utils.getGreeting('Alex');
    expect(greeting).toMatch(/Alex/);
  });
  it('cleanLeadData cleans invalid email and phone', () => {
    const dirty = {
      name: '  John  ',
      email: 'bad',
      phone: 'abc',
      tags: ['a', 'a', ''],
      notes: '  hi  ',
    };
    const clean = utils.cleanLeadData(dirty as any);
    expect(clean.name).toBe('John');
    expect(clean.email).toBe('');
    expect(clean.phone).toBeUndefined();
    expect(clean.tags).toEqual(['a']);
    expect(clean.notes).toBe('hi');
  });
});
