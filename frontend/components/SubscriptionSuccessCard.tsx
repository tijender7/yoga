'use client'

import { useState, useEffect } from 'react'
import Confetti from 'react-confetti'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Loader2 } from "lucide-react"

interface SubscriptionSuccessCardProps {
  onClose: () => void;
}

export default function SubscriptionSuccessCard({ onClose }: SubscriptionSuccessCardProps) {
  const [status, setStatus] = useState<'loading' | 'success'>('loading')
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('success')
      setShowConfetti(true)
    }, 2000) // Simulate 2 seconds of loading

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 5000) // Stop confetti after 5 seconds
      return () => clearTimeout(timer)
    }
  }, [showConfetti])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <AnimatePresence mode="wait">
        {status === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Loader2 className="w-16 h-16 animate-spin text-primary" />
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="w-[350px]">
              <CardHeader>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <CardTitle className="text-center text-2xl">Subscription Successful!</CardTitle>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <CardDescription className="text-center">Thank you for subscribing</CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 }}
                >
                  <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
                </motion.div>
                <motion.p 
                  className="text-center text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  Your payment was successful and your subscription is now active.
                </motion.p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button onClick={onClose} size="lg">
                    Close
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}