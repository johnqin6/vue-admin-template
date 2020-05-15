import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import Home from '@/views/Home'

describe('Home.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(Home, {
      name: 'Home'
    })
    expect(wrapper.text()).to.include(msg)
  })
})
