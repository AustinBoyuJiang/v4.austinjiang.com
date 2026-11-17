import { lazy, Suspense } from 'react'
import EffectBoundary from './EffectBoundary'
import { supportsWebGL } from '../utils/webgl'
import './StarryBackground.css'

// WebGL effects load after first paint so they never block the page
const Particles = lazy(() => import('./Particles'))
const PixelBlast = lazy(() => import('./PixelBlast'))

const ProfileBackground = ({ children, className = '', style = {} }) => {
    // 可以通过这个变量切换背景类型
    // 'particles' = WebGL 3D粒子, 'pixels' = PixelBlast效果, 'css' = CSS星空
    const backgroundType = 'particles'
    // Without WebGL, skip the effect (and its download); the content still renders on the plain background
    const webglEffects = supportsWebGL()

    if (backgroundType === 'particles') {
        // WebGL 3D粒子背景
        // https://reactbits.dev/backgrounds/particles
        return (
            <div style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1,
                ...style
            }}>
                {webglEffects && (
                <EffectBoundary>
                <Suspense fallback={null}>
                <Particles
                    particleColors={['#87ceeb', '#5fb3d4', '#ffffff']}
                    particleCount={300}
                    particleSpread={15}
                    speed={0.15}
                    particleBaseSize={150}
                    moveParticlesOnHover={true}
                    particleHoverFactor={3}
                    alphaParticles={false}
                    disableRotation={false}
                    sizeRandomness={1.5}
                    className={className}
                />
                </Suspense>
                </EffectBoundary>
                )}
                {children && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 10,
                        pointerEvents: 'auto'
                    }}>
                        {children}
                    </div>
                )}
            </div>
        )
    } else if (backgroundType === 'pixels') {
        // PixelBlast 背景
        // https://reactbits.dev/backgrounds/pixel-blast
        return (
            <div style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1,
                ...style
            }}>
                {webglEffects && (
                <EffectBoundary>
                <Suspense fallback={null}>
                <PixelBlast
                    variant="circle"
                    pixelSize={6}
                    color="#87ceeb"
                    patternScale={3}
                    patternDensity={1.2}
                    pixelSizeJitter={0.5}
                    enableRipples={true}
                    rippleSpeed={0.4}
                    rippleThickness={0.12}
                    rippleIntensityScale={1.5}
                    liquid={false}
                    liquidStrength={0.12}
                    liquidRadius={1.2}
                    liquidWobbleSpeed={5}
                    speed={0.6}
                    edgeFade={0.25}
                    transparent={true}
                    className={className}
                />
                </Suspense>
                </EffectBoundary>
                )}
                {children && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 10,
                        pointerEvents: 'auto'
                    }}>
                        {children}
                    </div>
                )}
            </div>
        )
    } else {
        // CSS 星空背景
        return (
            <div className={`starry-background starry-background-extra ${className}`} style={style}>
                {children}
            </div>
        )
    }
}

export default ProfileBackground