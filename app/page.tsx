import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Facebook, Instagram, MessageCircle, Star, CheckCircle2, Leaf, Heart, Users, Shield, Clock, Zap, Brain, Sun } from 'lucide-react'
import YogaCarousel from '@/components/ui/YogaCarousel'
import FlowingYogaEnergyBackground from '@/components/ui/FlowingYogaEnergyBackground'
import StickyJoinForm from '@/components/ui/StickyJoinForm'

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
        <section className="w-full py-18 md:py-36 lg:py-48 xl:py-72 relative bg-gradient-to-br from-purple-800 to-indigo-900 overflow-hidden">
          <FlowingYogaEnergyBackground />
          <div className="container px-4 md:px-6 relative z-10">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white mb-4">
                Transform Your Mind & Body with Yoga
              </h1>
              <p className="max-w-[600px] text-zinc-200 md:text-xl mx-auto mb-6">
                Join online yoga classes tailored for every level, from beginners to advanced.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                <Button size="lg">Start Your Free Trial</Button>
                <Button variant="outline" size="lg">See Class Schedule</Button>
              </div>
            </div>
          </div>
        </section>
        
        <StickyJoinForm />
        
        <section className="w-full py-10 md:py-20 lg:py-28 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8 text-gray-800">Our Students in Action</h2>
            <YogaCarousel />
          </div>
        </section>

        <section id="about" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8 text-gray-800">About Us</h2>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              {/* Left column - text content */}
              <Card className="p-6 h-full flex flex-col justify-between" style={{ minHeight: '660px' }}>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Our Philosophy & Benefits of Yoga</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Leaf className="w-5 h-5 mr-2 text-primary" />
                        <span className="text-sm text-gray-700">Transformative power of yoga for all levels</span>
                      </li>
                      <li className="flex items-start">
                        <Heart className="w-5 h-5 mr-2 text-primary" />
                        <span className="text-sm text-gray-700">Holistic practice nurturing mind, body, and spirit</span>
                      </li>
                      <li className="flex items-start">
                        <Users className="w-5 h-5 mr-2 text-primary" />
                        <span className="text-sm text-gray-700">Inclusive classes for all ages and fitness levels</span>
                      </li>
                      <li className="flex items-start">
                        <Clock className="w-5 h-5 mr-2 text-primary" />
                        <span className="text-sm text-gray-700">Feel younger and more energetic</span>
                      </li>
                      <li className="flex items-start">
                        <Zap className="w-5 h-5 mr-2 text-primary" />
                        <span className="text-sm text-gray-700">Increased flexibility and strength</span>
                      </li>
                      <li className="flex items-start">
                        <Brain className="w-5 h-5 mr-2 text-primary" />
                        <span className="text-sm text-gray-700">Stress reduction and improved mental clarity</span>
                      </li>
                      <li className="flex items-start">
                        <Sun className="w-5 h-5 mr-2 text-primary" />
                        <span className="text-sm text-gray-700">Investment in long-term health and well-being</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Our Journey</h3>
                    <p className="text-sm text-gray-700">Founded in 2010, YogaHarmony has grown from a local studio to a global online platform, connecting thousands of yoga enthusiasts worldwide.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Expert-Led Instruction</h3>
                    <p className="text-sm text-gray-700 mb-2">Our lead instructor, Suman Arya, holds a 500-hour Yoga Teacher Certification.</p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Shield className="w-5 h-5 mr-2 text-primary" />
                        <span className="text-sm text-gray-700">Advanced expertise in yoga philosophy and techniques</span>
                      </li>
                      <li className="flex items-start">
                        <Shield className="w-5 h-5 mr-2 text-primary" />
                        <span className="text-sm text-gray-700">Safety-focused instruction for all levels</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 italic">"Yoga is the journey of the self, through the self, to the self." - The Bhagavad Gita</p>
                </div>
              </Card>
              
              {/* Right column - image and details */}
              <Card className="p-6 h-full flex flex-col justify-between" style={{ minHeight: '660px' }}>
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-full h-[500px] flex justify-center items-center bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src="https://dmewjfaaihwxscvhzmxv.supabase.co/storage/v1/object/public/images/students/suman_masi_image.jpg"
                      alt="Suman Arya"
                      width={500}
                      height={500}
                      style={{ width: 'auto', height: '100%', objectFit: 'contain' }}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="w-full text-center">
                    <h3 className="text-xl font-bold text-gray-800">Suman Arya</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">500-Hour Certified Yoga Instructor</p>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                      With over a decade of experience, Suman Arya brings unparalleled expertise to every class, offering a transformative experience for all levels.
                    </p>
                  </div>
                </div>
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
                { name: 'Priya Sharma', quote: 'Transformed my practice!', rating: 5, image: 'https://dmewjfaaihwxscvhzmxv.supabase.co/storage/v1/object/public/images/students/test1.jpg' },
                { name: 'Emma Wilson', quote: 'Best yoga classes ever!', rating: 5, image: 'https://dmewjfaaihwxscvhzmxv.supabase.co/storage/v1/object/public/images/students/test2.jpg' },
                { name: 'Olivia Thompson', quote: 'Incredible instructor and community!', rating: 5, image: 'https://dmewjfaaihwxscvhzmxv.supabase.co/storage/v1/object/public/images/students/test3.jfif' },
              ].map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={100}
                        height={100}
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        className="rounded-full"
                        unoptimized
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
                { 
                  title: 'Monthly', 
                  price: '$55', 
                  originalPrice: '$90',
                  duration: '1 month',
                  features: [
                    'All Inclusive',
                    '5 days a week, 1 hour sessions',
                    'Zoom sessions with privacy',
                    'Hardcore stretching',
                    'Flexibility training',
                    'Strength training',
                    'Posture fix',
                    'Personalized feel',
                    'Price increases to $90 after first month'
                  ]
                },
                { 
                  title: 'Annual', 
                  price: '$55/month', 
                  duration: '12 months',
                  totalPrice: '$660',
                  savings: '$420',
                  popular: true,
                  features: [
                    'All Inclusive',
                    'All features of Monthly plan',
                    'Best value for money',
                    'Total cost: $660 for 12 months',
                    'Save $420 compared to monthly plan'
                  ]
                },
                { 
                  title: '6 Months', 
                  price: '$70/month', 
                  duration: '6 months',
                  totalPrice: '$420',
                  savings: '$120',
                  features: [
                    'All Inclusive',
                    'All features of Monthly plan',
                    'Discounted rate for 6 months',
                    'Total cost: $420 for 6 months',
                    'Save $120 compared to monthly plan'
                  ]
                },
              ].map((plan, index) => (
                <Card key={index} className={`flex flex-col ${plan.popular ? 'border-2 border-primary' : ''}`}>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-800">
                      {plan.title}
                      {plan.popular && (
                        <span className="ml-2 px-2 py-1 text-xs font-semibold text-white bg-primary rounded-full">
                          Most Popular
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-grow">
                    <div className="mb-4">
                      <p className="text-4xl font-bold mb-2 text-gray-800">{plan.price}</p>
                      {plan.originalPrice && (
                        <p className="text-sm text-gray-500 mb-4">
                          <span className="line-through">{plan.originalPrice}</span> Limited time offer!
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mb-4">Billed {plan.duration === '1 month' ? 'monthly' : `every ${plan.duration}`}</p>
                      {plan.totalPrice && (
                        <p className="text-lg font-semibold text-gray-700 mb-2">Total: {plan.totalPrice}</p>
                      )}
                      {plan.savings && (
                        <p className="text-lg font-semibold text-green-600 mb-4">You save: {plan.savings}</p>
                      )}
                    </div>
                    <ul className="space-y-2 mb-4 flex-grow">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-gray-700 dark:text-gray-300">
                          <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-auto">Subscribe Now</Button>
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
                  <span className="sr-only">MessageCircle</span>
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