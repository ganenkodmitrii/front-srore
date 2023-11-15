import React from 'react'

import { Text } from '@chakra-ui/react'

import { animate } from 'framer-motion'

interface CounterProps {
  from: number
  to: number
  text: string
}

const Counter = ({ from, to, text, children }: React.PropsWithChildren<CounterProps>) => {
  const [isInView, setIsInView] = React.useState(false)
  const nodeRef = React.useRef<HTMLParagraphElement>(null)

  React.useEffect(() => {
    const node = nodeRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
          }
        })
      },
      { threshold: 0.1 },
    )

    observer.observe(node)

    return () => {
      observer.unobserve(node)
    }
  }, [])

  React.useEffect(() => {
    if (!isInView) return
    const node = nodeRef.current
    if (!node) return
    const controls = animate(from, to, {
      duration: 2,
      onUpdate(value) {
        node.textContent = value.toFixed() + text
      },
    })
    return () => controls.stop()
  }, [from, to, isInView, text])
  return (
    <Text color="dark-grey.400" fontSize={[50, 96]} fontWeight="600" display="flex" ref={nodeRef}>
      {children}
    </Text>
  )
}

export default Counter
