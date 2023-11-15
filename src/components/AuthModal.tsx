'use client'

import React from 'react'

import { Modal, ModalOverlay, ModalContent } from '@chakra-ui/react'

import { AnimatePresence, motion } from 'framer-motion'

import { ConfirmEmail, Login, Register, ResetPassword, SetNewPassword } from '.'

interface AuthModalProps {
  redirectUrlForGuest?: string
  isOpen: boolean
  onClose: () => void
  uid?: string | null
  token?: string | null
}

const AuthModal = ({ redirectUrlForGuest, isOpen, uid, token, onClose }: AuthModalProps) => {
  const [step, setStep] = React.useState<string>(uid && token ? 'set_new_password' : 'login')

  const onRegisterClick = () => setStep('register')
  const onResetPasswordClick = () => setStep('reset_password')
  const onLoginClick = () => setStep('login')
  const onRegisterSuccess = () => setStep('register_confirm_email')
  const onResetPasswordSuccess = () => setStep('reset_password_email_confirmation')

  const steps = {
    login: (
      <Login
        redirectUrlForGuest={redirectUrlForGuest}
        onRegisterClick={onRegisterClick}
        onResetPasswordClick={onResetPasswordClick}
        onCloseModal={onClose}
      />
    ),
    register: <Register onLoginClick={onLoginClick} onRegisterSuccess={onRegisterSuccess} />,
    register_confirm_email: <ConfirmEmail translationKey="forms.register_email_confirmation" onModalClose={onClose} />,
    reset_password: <ResetPassword onResetPasswordSuccess={onResetPasswordSuccess} onLoginClick={onLoginClick} />,
    reset_password_email_confirmation: (
      <ConfirmEmail translationKey="forms.reset_passwword_email_confirmation" onModalClose={onClose} />
    ),
    set_new_password: uid && token && <SetNewPassword uid={uid} token={token} onSuccess={onLoginClick} />,
  }

  const onModalClose = () => {
    onClose()
    setStep('login')
  }

  return (
    <Modal isOpen={isOpen} onClose={onModalClose} isCentered>
      <ModalOverlay />
      <ModalContent minW={{ base: 0, md: '512px' }} overflow="hidden">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={step}
            transition={{ duration: 0.3 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            initial={{ x: 300, opacity: 0, scale: 0.6 }}
            exit={{ x: -300, opacity: 0, scale: 0.6 }}
          >
            {steps[step as keyof typeof steps]}
          </motion.div>
        </AnimatePresence>
      </ModalContent>
    </Modal>
  )
}

export default AuthModal
