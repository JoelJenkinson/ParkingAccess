import React, { useState, useEffect } from 'react';
import { QrCode, Info, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Simulated database
const initialBays = [
  'L8', 'L12', 'L13', 'L14', 'L17', 'L42', 'L43', 'L44', 'L59',
  'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12', 'T13', 'T14', 'T15',
  'T16', 'T17', 'T18', 'T19', 'T26', 'T27', 'T33', 'T34', 'T35', 'T36',
  'T45', 'T46', 'T47', 'T48', 'T49', 'T50', 'T51', 'T52', 'T53', 'T54',
  'T55', 'T56', 'T57', 'T58', 'T61', 'T62', 'T63', 'T64'
];

const ParkingApp = () => {
  const [page, setPage] = useState('entry');
  const [name, setName] = useState('');
  const [cell, setCell] = useState('');
  const [availableBays, setAvailableBays] = useState(initialBays);
  const [parkingHistory, setParkingHistory] = useState([]);
  const [newBay, setNewBay] = useState('');
  const [assignedBay, setAssignedBay] = useState(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [activeTab, setActiveTab] = useState('available-bays');
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [parkingCost, setParkingCost] = useState(0);

  const calculateParkingCost = (entry) => {
    const now = new Date();
    const entryTime = new Date(entry);
    const hours = Math.ceil((now - entryTime) / (1000 * 60 * 60));
    return hours * 5;
  };

  const handleEntry = () => {
    if (!name || !cell) {
      alert('Please enter both name and cell number');
      return;
    }

    if (availableBays.length === 0) {
      alert('Sorry, the parking is full right now');
      return;
    }

    const randomBay = availableBays[Math.floor(Math.random() * availableBays.length)];
    setAssignedBay(randomBay);
    
    const newParking = {
      name,
      cell,
      in: new Date().toISOString(),
      bay: randomBay
    };

    setParkingHistory([newParking, ...parkingHistory]);
    setAvailableBays(availableBays.filter(bay => bay !== randomBay));
  };

  const handleExit = () => {
    const parking = parkingHistory.find(
      p => p.name === name && p.cell === cell && !p.out
    );

    if (!parking) {
      alert('No active parking found for these credentials');
      return;
    }

    const cost = calculateParkingCost(parking.in);
    setParkingCost(cost);
  };

  const handlePayment = () => {
    const parkingIndex = parkingHistory.findIndex(
      p => p.name === name && p.cell === cell && !p.out
    );

    if (parkingIndex !== -1) {
      const updatedHistory = [...parkingHistory];
      updatedHistory[parkingIndex] = {
        ...updatedHistory[parkingIndex],
        out: new Date().toISOString(),
        cost: parkingCost
      };
      setParkingHistory(updatedHistory);
      setAvailableBays([...availableBays, updatedHistory[parkingIndex].bay]);
      setShowPaymentSuccess(true);
    }
  };

  const handleAdminLogin = () => {
    if (adminUsername === 'jenkinson' && adminPassword === '0827999390') {
      setAdminLoggedIn(true);
      setShowAdminLogin(false);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setAdminLoggedIn(false);
    setAdminUsername('');
    setAdminPassword('');
    setPage('entry');
  };

  const handleAddBay = () => {
    if (newBay && !availableBays.includes(newBay)) {
      setAvailableBays([...availableBays, newBay]);
      setNewBay('');
    }
  };

  const handleRemoveBay = (bay) => {
    setAvailableBays(availableBays.filter(b => b !== bay));
  };

  const handleOverride = () => {
    const parkingIndex = parkingHistory.findIndex(
      p => p.name === name && p.cell === cell && !p.out
    );

    if (parkingIndex !== -1) {
      const updatedHistory = [...parkingHistory];
      updatedHistory[parkingIndex] = {
        ...updatedHistory[parkingIndex],
        out: new Date().toISOString(),
        cost: calculateParkingCost(updatedHistory[parkingIndex].in)
      };
      setParkingHistory(updatedHistory);
      setAvailableBays([...availableBays, updatedHistory[parkingIndex].bay]);
      alert('Payment processed successfully');
      setName('');
      setCell('');
    } else {
      alert('No active parking found for these credentials');
    }
  };

  const resetForm = () => {
    setName('');
    setCell('');
    setAssignedBay(null);
    setShowPaymentSuccess(false);
    setParkingCost(0);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 relative">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex space-x-4 mb-4">
          <Button
            onClick={() => { setPage('entry'); resetForm(); }}
            variant={page === 'entry' ? 'default' : 'outline'}
          >
            Entry
          </Button>
          <Button
            onClick={() => { setPage('exit'); resetForm(); }}
            variant={page === 'exit' ? 'default' : 'outline'}
          >
            Exit
          </Button>
        </div>

        {page === 'entry' && !assignedBay && (
          <Card>
            <CardHeader>
              <CardTitle>Enter Parking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="First Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                placeholder="Cell Number"
                value={cell}
                onChange={(e) => setCell(e.target.value)}
              />
              <Button onClick={handleEntry} className="w-full">
                Save
              </Button>
            </CardContent>
          </Card>
        )}

        {page === 'entry' && assignedBay && (
          <Card>
            <CardContent className="text-center py-8">
              <div className="text-6xl font-bold mb-4">{assignedBay}</div>
              <div className="text-xl">Thank you, please park in bay {assignedBay}</div>
            </CardContent>
          </Card>
        )}

        {page === 'exit' && !showPaymentSuccess && (
          <Card>
            <CardHeader>
              <CardTitle>Exit Parking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="First Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                placeholder="Cell Number"
                value={cell}
                onChange={(e) => setCell(e.target.value)}
              />
              <Button onClick={handleExit} className="w-full">
                Calculate Cost
              </Button>
              {parkingCost > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">
                    Amount Due: R{parkingCost}
                  </div>
                  <Button onClick={handlePayment} className="w-full">
                    Pay Now
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {page === 'exit' && showPaymentSuccess && (
          <Card>
            <CardContent className="text-center py-8">
              <div className="text-2xl font-bold mb-4">Thanks for your payment</div>
              <QrCode className="mx-auto w-32 h-32" />
            </CardContent>
          </Card>
        )}

        {adminLoggedIn && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Admin Panel</CardTitle>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="available-bays">Available Bays</TabsTrigger>
                  <TabsTrigger value="parking-history">Parking History</TabsTrigger>
                  <TabsTrigger value="override">Override</TabsTrigger>
                </TabsList>

                <TabsContent value="available-bays">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="New Bay Number"
                        value={newBay}
                        onChange={(e) => setNewBay(e.target.value)}
                      />
                      <Button onClick={handleAddBay}>Add Bay</Button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {availableBays.map((bay) => (
                        <div
                          key={bay}
                          className="flex items-center justify-between p-2 bg-white rounded border"
                        >
                          {bay}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveBay(bay)}
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="parking-history">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left p-2">Name</th>
                          <th className="text-left p-2">Cell</th>
                          <th className="text-left p-2">In</th>
                          <th className="text-left p-2">Out</th>
                          <th className="text-left p-2">Duration</th>
                          <th className="text-right p-2">Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parkingHistory.map((record, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-2">{record.name}</td>
                            <td className="p-2">{record.cell}</td>
                            <td className="p-2">
                              {new Date(record.in).toLocaleString()}
                            </td>
                            <td className="p-2">
                              {record.out
                                ? new Date(record.out).toLocaleString()
                                : 'Parked'}
                            </td>
                            <td className="p-2">
                              {record.out
                                ? `${Math.ceil(
                                    (new Date(record.out) - new Date(record.in)) /
                                      (1000 * 60 * 60)
                                  )}h`
                                : ''}
                            </td>
                            <td className="p-2 text-right">
                              {record.cost ? `R${record.cost}` : ''}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="override">
                  <div className="space-y-4">
                    <Input
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                      placeholder="Cell Number"
                      value={cell}
                      onChange={(e) => setCell(e.target.value)}
                    />
                    <Button onClick={handleOverride} className="w-full">
                      Mark as Paid
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Admin Login Modal */}
      {showAdminLogin && !adminLoggedIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Admin Login</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Username"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
                <div className="flex space-x-2">
                  <Button onClick={handleAdminLogin} className="flex-1">
                    Login
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAdminLogin(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Admin Info Icon */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-4 right-4"
        onClick={() => setShowAdminLogin(true)}
      >
        <Info className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default ParkingApp;