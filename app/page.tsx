import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Facebook, Instagram, MessageCircle, Star, CheckCircle2 } from 'lucide-react'
import YogaCarousel from '@/components/ui/YogaCarousel'
import FlowingYogaEnergyBackground from '@/components/ui/FlowingYogaEnergyBackground'

export default function YogaLanding() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-white shadow-sm">
        <Link className="flex items-center justify-center" href="#">
          <span className="text-2xl font-bold text-primary">YogaHarmony</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium text-gray-700 hover:underline underline-offset-4" href="#about">About</Link>
          <Link className="text-sm font-medium text-gray-700 hover:underline underline-offset-4" href="#services">Services</Link>
          <Link className="text-sm font-medium text-gray-700 hover:underline underline-offset-4" href="#pricing">Pricing</Link>
          <Link className="text-sm font-medium text-gray-700 hover:underline underline-offset-4" href="#contact">Contact</Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative bg-gradient-to-br from-purple-800 to-indigo-900 overflow-hidden">
          <FlowingYogaEnergyBackground />
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                    Transform Your Mind & Body with Yoga
                  </h1>
                  <p className="max-w-[600px] text-zinc-200 md:text-xl">
                    Join online yoga classes tailored for every level, from beginners to advanced.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg">Start Your Free Trial</Button>
                  <Button variant="outline" size="lg">See Class Schedule</Button>
                </div>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Join Our Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <form>
                    <div className="grid gap-4">
                      <Input placeholder="Name" />
                      <Input placeholder="Email" type="email" />
                      <Input placeholder="Interest (e.g., Beginner Yoga)" />
                      <Button type="submit">Join Now</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8 text-gray-800">Our Students in Action</h2>
            <YogaCarousel />
          </div>
        </section>

        <section id="about" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8 text-gray-800">About Us</h2>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  At YogaHarmony, we believe in the transformative power of yoga. Our online classes focus on improving health, promoting relaxation, and enhancing flexibility. Whether you're a beginner or an advanced practitioner, we have a class that's perfect for you.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Our mission is to bring the benefits of yoga to everyone, anywhere. We started these online classes to make yoga accessible, focusing on stress relief, physical fitness, and mental wellness.
                </p>
              </div>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Image
                      src="https://dmewjfaaihwxscvhzmxv.supabase.co/storage/v1/object/public/images/students/main_image.png?t=2024-09-18T07%3A45%3A34.062Z"
                      alt="Suman Arya"
                      width={100}
                      height={100}
                      className="rounded-full"
                    />
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">Suman Arya</h3>
                      <p className="text-gray-600 dark:text-gray-400">Lead Yoga Instructor</p>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-700 dark:text-gray-300">
                    Suman Arya is a certified yoga instructor with over 10 years of experience. She specializes in Hatha and Vinyasa yoga and is passionate about helping her students achieve balance in mind and body.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8 text-gray-800">Yoga Classes Tailored for You</h2>
            <div className="grid gap-6 lg:grid-cols-3">
              {['Beginner Yoga', 'Advanced Yoga', 'Stress Relief Yoga'].map((service) => (
                <Card key={service}>
                  <CardHeader>
                    <CardTitle className="text-gray-800">{service}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300">
                      Perfect for those who want to {service.toLowerCase() === 'beginner yoga' ? 'start their yoga journey' : service.toLowerCase() === 'advanced yoga' ? 'deepen their practice' : 'find inner peace'}.
                    </p>
                    <Button className="mt-4">Learn More</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8 text-gray-800">What Our Clients Say</h2>
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                { name: 'Sarah M.', quote: 'Changed my life!', rating: 5 },
                { name: 'John D.', quote: 'Best decision I ever made!', rating: 5 },
                { name: 'Emily L.', quote: 'Incredible classes and instructor!', rating: 5 },
              ].map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Image
                        src="https://dmewjfaaihwxscvhzmxv.supabase.co/storage/v1/object/public/images/students/main_image.png?t=2024-09-18T07%3A45%3A34.062Z"
                        alt={testimonial.name}
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{testimonial.name}</p>
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">"{testimonial.quote}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8 text-gray-800">Why Choose Our Online Yoga Classes?</h2>
            <div className="grid gap-6 lg:grid-cols-4">
              {[
                { title: 'Affordable Pricing', icon: CheckCircle2 },
                { title: 'Certified Instructors', icon: CheckCircle2 },
                { title: 'Classes for All Levels', icon: CheckCircle2 },
                { title: 'Accessible Anytime, Anywhere', icon: CheckCircle2 },
              ].map((benefit, index) => (
                <Card key={index}>
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <benefit.icon className="w-12 h-12 mb-4 text-primary" />
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{benefit.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300">Experience the benefits of yoga with our flexible and high-quality classes.</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-4 text-gray-800">Ready to transform your life?</h2>
            <p className="max-w-[600px] text-gray-700 md:text-xl dark:text-gray-300 mx-auto mb-8">
              Join our community today and start your journey towards a healthier, more balanced you.
            </p>
            <Button size="lg">Get Started</Button>
          </div>
        </section>
        
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8 text-gray-800">Simple and Affordable Plans</h2>
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                { title: 'Monthly', price: '$49', features: ['Unlimited access to all classes', 'Personal dashboard', '24/7 support'] },
                { title: 'Annual', price: '$399', features: ['2 months free', 'Unlimited access to all classes', 'Personal dashboard', '24/7 support', 'Exclusive workshops'] },
                { title: 'Pay-as-you-go', price: '$10', features: ['Access to individual classes', 'No commitment', 'Try different styles'] },
              ].map((plan, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-gray-800">{plan.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold mb-4 text-gray-800">{plan.price}</p>
                    <ul className="space-y-2 mb-4">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-gray-700 dark:text-gray-300">
                          <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full">Subscribe Now</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-4 text-gray-800">Try a Free Class This Saturday</h2>
            <p className="max-w-[600px] text-gray-700 md:text-xl dark:text-gray-300 mx-auto mb-8">
              Experience the benefits of our yoga classes with no commitment. Join our free Saturday trial class and see the difference for yourself.
            </p>
            <Button size="lg">Book Your Free Class Now</Button>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8 text-gray-800">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
              {[
                { question: 'What is the duration of each class?', answer: 'Our classes typically last 60 minutes, but we also offer 30-minute and 90-minute sessions for certain styles.' },
                { question: 'Do I need equipment?', answer: 'For most classes, you\'ll need a yoga mat. Some classes may require additional props like blocks or straps, but we\'ll let you know in advance.' },
                { question: 'What is your cancellation policy?', answer: 'You can cancel or reschedule a class up to 2 hours before it starts without any penalty.' },
              ].map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-gray-800">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-700 dark:text-gray-300">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
      <footer id="contact" className="w-full py-6 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-gray-800">YogaHarmony</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Transforming lives through the power of yoga.</p>
              <div className="flex gap-4">
                <Link href="#" className="text-gray-500 hover:text-gray-700">
                  <Facebook className="w-6 h-6" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-gray-500 hover:text-gray-700">
                  <Instagram className="w-6 h-6" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="#" className="text-gray-500 hover:text-gray-700">
                  <MessageCircle className="w-6 h-6" />
                  <span className="sr-only">WhatsApp</span>
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-4 lg:items-end">
              <form className="w-full max-w-sm">
                <Input placeholder="Enter your email" type="email" />
                <Button type="submit" className="mt-2 w-full">Subscribe to Newsletter</Button>
              </form>
              <p className="text-sm text-gray-600 dark:text-gray-400">123 Yoga Street, Zen City, 12345</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">contact@yogaharmony.com</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 flex flex-col-reverse gap-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-xs text-gray-600 dark:text-gray-400">© 2023 YogaHarmony. All rights reserved.</p>
            <nav className="flex gap-4">
              <Link className="text-xs text-gray-600 hover:underline underline-offset-4" href="#">
                Privacy Policy
              </Link>
              <Link className="text-xs text-gray-600 hover:underline underline-offset-4" href="#">
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}