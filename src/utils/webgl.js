// Whether this browser can create a WebGL context. Checked once and cached:
// some browsers, VMs and locked-down setups have WebGL disabled entirely.
let cachedSupport = null

export const supportsWebGL = () => {
  if (cachedSupport !== null) return cachedSupport
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    cachedSupport = !!gl
    // Release the probe context so it doesn't count against the browser's context limit
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    cachedSupport = false
  }
  return cachedSupport
}
