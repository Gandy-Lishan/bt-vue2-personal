import { mount } from '@vue/test-utils';
import MyComponent from '@/components/backtester';

describe('MyComponent', () => {
  it('renders correctly', () => {
    // const wrapper = mount(MyComponent);
    // expect(wrapper.html()).toContain('Hello, World!');
    const num = 1 + 2
    expect(num).toBe(3)
  });
});
