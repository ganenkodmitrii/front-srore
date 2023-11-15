import {
  Box,
  Stack,
  Step,
  StepIndicator,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Text,
  useSteps,
} from '@chakra-ui/react'

export interface StepsType {
  title: string
}

interface StepsProps {
  steps: StepsType[]
  currentStep?: number
}

const Steps = ({ steps, currentStep }: StepsProps) => {
  const { activeStep } = useSteps({
    index: currentStep,
    count: steps.length,
  })

  return (
    <Stepper size="xs" index={activeStep} orientation="vertical" gap="0px" minH={steps.length < 3 ? '30px' : '100px'}>
      {steps.map((step, index) => (
        <Step key={index}>
          <Stack align="end" pt="4px">
            <StepIndicator border="none" color="light-grey.100" bg="light-grey.100">
              <StepStatus
                complete={<Box bgColor="light-grey.100" h="100%" w="100%" rounded="full" />}
                incomplete={<Box bgColor="light-grey.100" h="100%" w="100%" rounded="full" />}
                active={<Box bgColor="light-grey.400" h="60%" w="60%" rounded="full" />}
              />
            </StepIndicator>
          </Stack>

          <StepTitle>
            <Text fontSize="14px" color={index === activeStep ? 'dark-grey.400' : 'mid-grey.400'}>
              {step.title}
            </Text>
          </StepTitle>

          <StepSeparator style={{ marginTop: '5px' }} />
        </Step>
      ))}
    </Stepper>
  )
}

export default Steps
