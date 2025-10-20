import './StarryBackground.css'

const StarryBackground = ({ children, className = '', style = {} }) => {
  return (
    <div className={`starry-background ${className}`} style={style}>
      {children}
    </div>
  )
}

export default StarryBackground