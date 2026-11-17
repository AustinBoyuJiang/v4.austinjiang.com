import { Component } from 'react'

// Wraps decorative effects (WebGL backgrounds). If one throws while starting up,
// only the effect disappears; the rest of the page keeps rendering.
class EffectBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.warn('Background effect disabled:', error)
  }

  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children
  }
}

export default EffectBoundary
