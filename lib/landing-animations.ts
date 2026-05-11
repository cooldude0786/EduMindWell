/**
 * Animation utilities and configurations
 */

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

export const slideInLeftVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export const slideInRightVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export const scaleUpVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

export const bounceCircleConfig = (duration: string) => ({
  animation: `bounce ${duration} infinite`,
})

export const pulseConfig = {
  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
}

export const hoverGrowTransition =
  'transition-all duration-300 hover:scale-105'

export const smoothTransition = 'transition-all duration-300'
