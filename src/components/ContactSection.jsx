import './ContactSection.css'

const ContactSection = ({ email }) => {
  return (
    <section id="contact" className="section">
      <div className="section-header">
        <h2 className="section-title">Contact</h2>
      </div>
      <div className="contact-content">
        <p className="contact-description">
          Feel free to reach out if you'd like to collaborate on a project,
          discuss opportunities, or just have a chat about technology! You can reach me at{' '}
          <a 
            href={`mailto:${email || 'your.email@uwaterloo.ca'}`} 
            className="contact-email"
          >
            {email || 'your.email@uwaterloo.ca'}
          </a>.
        </p>
      </div>
    </section>
  )
}

export default ContactSection