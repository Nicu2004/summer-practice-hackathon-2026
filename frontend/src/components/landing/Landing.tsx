import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'

const steps = [
  { icon: '👤', title: 'Create your profile', description: 'Set up a lightweight profile with your name and preferred sports.' },
  { icon: '🏅', title: 'Add your sports', description: 'Pick the sports you love and your fitness level.' },
  { icon: '📲', title: 'ShowUpToday?', description: 'Respond Yes or No to a daily prompt — we handle the rest.' },
  { icon: '🤝', title: 'Get matched', description: 'Get automatically matched into a suitable sports group near you.' },
  { icon: '💬', title: 'Join the chat', description: 'Connect with your group, coordinate, and get to know your teammates.' },
  { icon: '✅', title: 'Confirm participation', description: 'Let your group know you\'re showing up.' },
  { icon: '📍', title: 'Location & logistics', description: 'Get help coordinating where and when to meet.' },
  { icon: '🏃', title: 'Show up and play', description: 'That\'s it. Just show up and enjoy the game.' },
]

const features = [
  'Automatic sport group generation',
  'Manual event creation',
  'Group coordination',
  'Location assistance',
  'Lightweight social interaction',
]

// reusable animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const }
  })
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' as const } }
}

export default function Landing() {
  const navigate = useNavigate()

  return (
    <Box sx={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#f0f4f8',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      py: 6,
      px: 2,
    }}>

      {/* Hero */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        style={{ textAlign: 'center', maxWidth: 560, marginBottom: 48 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Typography variant="h3" sx={{ fontWeight: 600, color: '#007FFF', mb: 1 }}>
            ShowUp2Move
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            The simplest way to find people to play sports with — just say yes and show up.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{ display: 'flex', gap: 16, justifyContent: 'center' }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{ backgroundColor: '#007FFF', borderRadius: 2 }}
          >
            Get started
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/login')}
            sx={{ borderRadius: 2 }}
          >
            Log in
          </Button>
        </motion.div>
      </motion.div>

      <Divider sx={{ width: '100%', maxWidth: 560, mb: 6 }} />

      {/* How it works */}
      <Box sx={{ width: '100%', maxWidth: 560, mb: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h5" sx={{ fontWeight: 500, mb: 3, textAlign: 'center' }}>
            How it works
          </Typography>
        </motion.div>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {steps.map((step, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <Box sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: 3,
                padding: 2,
              }}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: 48,
                }}>
                  <Typography sx={{ fontSize: 28 }}>{step.icon}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {index + 1}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 500 }}>{step.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Box>

      <Divider sx={{ width: '100%', maxWidth: 560, mb: 6 }} />

      {/* Features */}
      <Box sx={{ width: '100%', maxWidth: 560, mb: 6, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h5" sx={{ fontWeight: 500, mb: 3 }}>
            What the platform supports
          </Typography>
        </motion.div>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
          {features.map((feature, index) => (
            <motion.div
              key={feature}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <Chip
                label={feature}
                color="primary"
                variant="outlined"
                sx={{ borderRadius: 2 }}
              />
            </motion.div>
          ))}
        </Box>
      </Box>

      <Divider sx={{ width: '100%', maxWidth: 560, mb: 6 }} />

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center' }}
      >
        <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
          Ready to move?
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/register')}
          sx={{ backgroundColor: '#007FFF', borderRadius: 2 }}
        >
          Create your profile
        </Button>
      </motion.div>

    </Box>
  )
}