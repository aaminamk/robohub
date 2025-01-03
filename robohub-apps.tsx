import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const RegistrationComponent = () => {
    const [formData, setFormData] = useState({
      email: '',
      name: '',
      surname: '',
      team: '',
      password: '',
      confirmPassword: ''
    });
    
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
  
      if (formData.password !== formData.confirmPassword) {
        setStatus({
          type: 'error',
          message: 'Passwords do not match'
        });
        setIsSubmitting(false);
        return;
      }
  
      try {
        const response = await fetch('https://dashboard.formspark.io/workspaces/9sHcpeVQo/forms/TMgYsGDAl/submissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            name: formData.name,
            surname: formData.surname,
            team: formData.team
          }),
        });
  
        if (response.ok) {
          setStatus({
            type: 'success',
            message: 'Registration successful! Please check your email for confirmation.'
          });
          setFormData({
            email: '',
            name: '',
            surname: '',
            team: '',
            password: '',
            confirmPassword: ''
          });
        } else {
          throw new Error('Registration failed');
        }
      } catch (error) {
        setStatus({
          type: 'error',
          message: 'Registration failed. Please try again later.'
        });
      } finally {
        setIsSubmitting(false);
      }
    };
  
    return (
      <div className="max-w-md mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="surname">Surname</Label>
                <Input
                  id="surname"
                  required
                  value={formData.surname}
                  onChange={(e) => setFormData({...formData, surname: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="team">Team Name</Label>
                <Input
                  id="team"
                  required
                  value={formData.team}
                  onChange={(e) => setFormData({...formData, team: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>
              
              {status.message && (
                <Alert variant={status.type === 'error' ? 'destructive' : 'default'}>
                  <AlertDescription>
                    {status.message}
                  </AlertDescription>
                </Alert>
              )}
  
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  };

  const RentalComponent = () => {
    const [step, setStep] = useState(1);
    const [cart, setCart] = useState([]);
    const [formData, setFormData] = useState({
      name: '',
      teamName: '',
      email: '',
      phone: '',
      rentalType: 'rent',
      agreement: null
    });

    const equipment = [
      { id: 1, name: 'goBILDA Motor 5202', price: 29.99, stock: 15 },
      { id: 2, name: 'Servo Motor MG996R', price: 19.99, stock: 20 },
      { id: 3, name: 'Arduino Mega 2560', price: 39.99, stock: 10 }
    ];

    const addToCart = (item) => setCart([...cart, item]);
    
    const removeFromCart = (itemId) => setCart(cart.filter(item => item.id !== itemId));
    
    const handleFileUpload = (e) => setFormData({ ...formData, agreement: e.target.files[0] });
    
    const handleSubmit = (e) => {
      e.preventDefault();
      setStep(4);
    };

    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>RoboHub Equipment Rental</CardTitle>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Available Equipment</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {equipment.map((item) => (
                    <Card key={item.id} className="p-4">
                      <Package className="w-8 h-8 mb-2" />
                      <h3 className="font-semibold">{item.name}</h3>
                      <p>${item.price}</p>
                      <p>Stock: {item.stock}</p>
                      <Button onClick={() => addToCart(item)} className="mt-2">
                        Add to Cart
                      </Button>
                    </Card>
                  ))}
                </div>
                {cart.length > 0 && (
                  <Button onClick={() => setStep(2)}>
                    Proceed to Cart
                  </Button>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Your Cart</h2>
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-4 border rounded">
                    <div>
                      <h3>{item.name}</h3>
                      <p>${item.price}</p>
                    </div>
                    <Button onClick={() => removeFromCart(item.id)}>Remove</Button>
                  </div>
                ))}
                <div className="flex justify-between">
                  <Button onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={() => setStep(3)}>Continue</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input
                    id="teamName"
                    value={formData.teamName}
                    onChange={(e) => setFormData({...formData, teamName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <RadioGroup 
                  value={formData.rentalType} 
                  onValueChange={(value) => setFormData({...formData, rentalType: value})}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rent" id="rent" />
                    <Label htmlFor="rent">Rent</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="buy" id="buy" />
                    <Label htmlFor="buy">Buy</Label>
                  </div>
                </RadioGroup>
                <div>
                  <Label htmlFor="agreement">Rental Agreement</Label>
                  <Input id="agreement" type="file" onChange={handleFileUpload} />
                </div>
                <div className="flex justify-between">
                  <Button type="button" onClick={() => setStep(2)}>Back</Button>
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            )}

            {step === 4 && (
              <div className="text-center py-8">
                <h2 className="text-xl font-semibold">Request Submitted!</h2>
                <p className="my-4">Thank you for your rental request.</p>
                <Button onClick={() => navigateTo('home')}>Return Home</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  if (currentPage === 'register') {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-lg fixed w-full z-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <button onClick={() => navigateTo('home')} className="text-2xl font-bold text-blue-600">
                RoboHub
              </button>
              <button onClick={() => navigateTo('home')} className="text-gray-700 hover:text-blue-600">
                Back to Home
              </button>
            </div>
          </div>
        </nav>
        <div className="pt-24">
          <RegistrationComponent />
        </div>
      </div>
    );
  }

  if (currentPage === 'rent') {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-lg fixed w-full z-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <button onClick={() => navigateTo('home')} className="text-2xl font-bold text-blue-600">
                RoboHub
              </button>
              <button onClick={() => navigateTo('home')} className="text-gray-700 hover:text-blue-600">
                Back to Home
              </button>
            </div>
          </div>
        </nav>
        <div className="pt-16">
          <RentalComponent />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <button onClick={() => navigateTo('home')} className="text-2xl font-bold text-blue-600">
              RoboHub
            </button>
            <div className="flex items-center space-x-8">
              <button onClick={() => navigateTo('rent')} className="text-gray-700 hover:text-blue-600">Rent</button>
              <button className="text-gray-700 hover:text-blue-600">Info</button>
              <button className="text-gray-700 hover:text-blue-600">Events</button>
              <button className="text-gray-700 hover:text-blue-600">Teams</button>
              <button onClick={() => navigateTo('register')} className="bg-blue-600 text-white px-4 py-2 rounded">Register</button>
            </div>
          </div>
        </div>
      </nav>

      <section className="h-screen bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center text-white pt-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to RoboHub</h1>
          <p className="text-xl mb-8">Your One-Stop Platform for FTC Robotics Equipment and Community</p>
          <button 
            onClick={() => navigateTo('rent')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100"
          >
            Start Renting Equipment
          </button>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Latest FTC News</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="overflow-hidden hover:-translate-y-1 transition-transform">
            <img src="/api/placeholder/400/200" alt="News 1" className="w-full h-48 object-cover" />
            <CardContent className="p-6">
              <span className="text-blue-600 text-sm font-semibold">Competition Update</span>
              <h3 className="text-xl font-bold mt-2">2024-2025 Game Reveal</h3>
              <p className="text-gray-600 mt-2">Get ready for an exciting new season! The latest FTC game challenge...</p>
              <Button variant="link" className="mt-4 p-0 text-blue-600">Read More →</Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden hover:-translate-y-1 transition-transform">
            <img src="/api/placeholder/400/200" alt="News 2" className="w-full h-48 object-cover" />
            <CardContent className="p-6">
              <span className="text-blue-600 text-sm font-semibold">Technical Resources</span>
              <h3 className="text-xl font-bold mt-2">New Control System Update</h3>
              <p className="text-gray-600 mt-2">Important updates to the FTC control system have been released...</p>
              <Button variant="link" className="mt-4 p-0 text-blue-600">Read More →</Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden hover:-translate-y-1 transition-transform">
            <img src="/api/placeholder/400/200" alt="News 3" className="w-full h-48 object-cover" />
            <CardContent className="p-6">
              <span className="text-blue-600 text-sm font-semibold">Community News</span>
              <h3 className="text-xl font-bold mt-2">Regional Championship Results</h3>
              <p className="text-gray-600 mt-2">Congratulations to all teams who participated...</p>
              <Button variant="link" className="mt-4 p-0 text-blue-600">Read More →</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">RoboHub</h3>
              <p className="text-gray-400">Supporting FTC teams with equipment and resources.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><button className="text-gray-400 hover:text-white">About Us</button></li>
                <li><button onClick={() => navigateTo('rent')} className="text-gray-400 hover:text-white">Equipment Rental</button></li>
                <li><button className="text-gray-400 hover:text-white">Events Calendar</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><button className="text-gray-400 hover:text-white">Documentation</button></li>
                <li><button className="text-gray-400 hover:text-white">FTC Rules</button></li>
                <li><button className="text-gray-400 hover:text-white">Technical Support</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">support@robohub.com</p>
              <p className="text-gray-400">+1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
