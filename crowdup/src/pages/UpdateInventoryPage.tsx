import React, { useState } from 'react';
import { Text, Select, SegmentedControl, Group, Button, Card, Divider, Container, Stack, Table, TextInput, Notification } from '@mantine/core';
import axios from 'axios';
import { log } from 'console';

const priorityMapping: Record<string, string> = {
  'Ventilator': 'High',
  'Oxygen Cylinder': 'High',
  'ICU Bed': 'High',
  'Anesthesia Machine': 'High',
  'Infusion Pump': 'Moderate',
  'Surgical Equipment': 'Moderate',
  'Wheelchair': 'Low',
  'Syringes': 'Low',
  'IV Fluids': 'Moderate',
  'Insulin': 'High',
  'Chemotherapy Drugs': 'High',
  'Antibiotics': 'Moderate',
  'Painkillers': 'Moderate',
  'Blood Thinners': 'Moderate',
  'Vaccines': 'Moderate',
  'Surgical Sedatives': 'Moderate',
  'X-ray Machine': 'High',
  'MRI Machine': 'High',
  'Ultrasound Machine': 'Moderate',
  'Blood Gas Analyzer': 'Moderate',
  'ECG Machine': 'Moderate',
  'Blood Glucose Meter': 'Low',
  'Pulse Oximeter': 'Moderate',
  'N95 Mask': 'Low',
  'Gloves': 'Low',
  'PPE Kit': 'Low',
  'Surgical Mask': 'Low',
  'Disposable Gowns': 'Low',
  'Pill Boxes': 'Low',
};

const categories = [
  'Medical Equipment',
  'Medications',
  'Personal Protective Equipment',
  'Beds',
  'Surgical Supplies',
  'Other'
];

const inventoryItemsList = [
    'Ventilator', 'Oxygen Cylinder', 'ICU Bed', 'Surgical Mask', 'PPE Kit', 'Gloves', 'IV Fluids', 'Syringes', 'Medical Equipment',
    'Medications', 'Wheelchairs', 'Blood Bags', 'Diagnostics Equipment', 'X-ray Machine', 'MRI Machine', 'Infusion Pump', 'Anesthesia Machine',
    'Insulin', 'Chemotherapy Drugs', 'Blood Thinners', 'Vaccines', 'Surgical Sedatives', 'Ultrasound Machine', 'Blood Gas Analyzer', 'ECG Machine',
    'Blood Glucose Meter', 'Pulse Oximeter'
  ];

interface InventoryItem {
  itemName: string | null;
  category: string;
  quantity: string;
  unit: string;
  condition: string;
  additionalDetails?: string;
  weightOrVolume?: string;
  purchaseDate?: Date;
  cost?: number;
  priority: string;
}

interface HospitalDetails {
  name: string;
  registrationNumber: string;
  email: string;
}

const InventoryPage: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [hospitalDetails, setHospitalDetails] = useState<HospitalDetails>({
    name: '',
    registrationNumber: '',
    email: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    const updatedItems = [...inventoryItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [name]: value,
    };
    updatedItems[index].priority = priorityMapping[updatedItems[index].itemName || ''] || 'Low';
    setInventoryItems(updatedItems);
  };

  const handleSelectChange = (value: string | null, index: number, field: 'itemName' | 'unit' | 'category') => {
    const updatedItems = [...inventoryItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    if (field === 'itemName') {
      updatedItems[index].priority = priorityMapping[value || ''] || 'Low';
    }
    setInventoryItems(updatedItems);
  };
  

const handleConditionChange = (value: string, index: number) => {
  const updatedItems = [...inventoryItems];
  updatedItems[index].condition = value;
  setInventoryItems(updatedItems);
};

  const handleAddStockItem = () => {
    setInventoryItems([
      ...inventoryItems,
      {
        itemName: null,
        category: categories[0],
        quantity: '',
        unit: 'Units',
        condition: 'New',
        additionalDetails: '',
        weightOrVolume: '',
        cost: 0,
        priority: 'Low',
      },
    ]);
  };


  const checkInventory = async () => {
    try {
      // Send the registration number to the backend to check if inventory exists
      const response = await axios.get(
        `http://localhost:8000/inventory/${hospitalDetails.registrationNumber}`
      );
      
      // Check if inventoryItems are available in the response
      if (response.data && response.data.inventoryItems && response.data.inventoryItems.length > 0) {
        // If inventory exists, populate the inventoryItems state with the existing data
        setInventoryItems(response.data.inventoryItems); // Correct reference to inventoryItems
        setSuccess("Inventory found!");
      } else {
        setInventoryItems([]); // Clear inventory if not found
        setSuccess("No inventory found for this hospital.");
      }
    } catch (error) {
      setError("Failed to check inventory.");
      setSuccess(null);
      console.error(error);
    }
  };
  const handleSubmit = async () => {
    // Validate form
    if (inventoryItems.some(item => !item.itemName || !item.quantity || !item.unit || !item.condition)) {
      setError('All fields must be filled out properly.');
      return;
    }
    
    if (!hospitalDetails.name || !hospitalDetails.registrationNumber || !hospitalDetails.email) {
      setError('Hospital details must be filled out.');
      return;
    }
    console.log(hospitalDetails)

    const payload = {
        registrationNumber: hospitalDetails.registrationNumber,  // Pass registration number separately
        inventoryData: inventoryItems,  // Pass inventory items as inventoryData
      };
      
    console.log(payload)

    try {
        const response = await axios.post('http://localhost:8000/update-inventory', payload);
        setSuccess('Inventory updated successfully!');
        setError(null);
        console.log(response.data); // Log response for debugging
      } catch (error) {
        setError('Failed o update inventory.');
        setSuccess(null);
        console.error(error); // Log error for debugging
      }      
  };

  const handleHospitalDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHospitalDetails({
      ...hospitalDetails,
      [name]: value
    });
  };

  return (
    <Container size="xl" py="xl">
      <Card shadow="sm" padding="lg">
        <Text align="center" size="xl" weight={700} mb="md">
          Hospital Inventory Management
        </Text>

        {error && (
          <Notification color="red" onClose={() => setError(null)}>
            {error}
          </Notification>
        )}

        {success && (
          <Notification color="green" onClose={() => setSuccess(null)}>
            {success}
          </Notification>
        )}

        {/* Hospital Details Form */}
        <Stack spacing="md">
          <TextInput
            label="Hospital Name"
            name="name"
            value={hospitalDetails.name}
            onChange={handleHospitalDetailsChange}
            placeholder="Enter hospital name"
            required
          />
          <TextInput
            label="Registration Number"
            name="registrationNumber"
            value={hospitalDetails.registrationNumber}
            onChange={handleHospitalDetailsChange}
            placeholder="Enter registration number"
            required
          />
          <TextInput
            label="Email ID"
            name="email"
            value={hospitalDetails.email}
            onChange={handleHospitalDetailsChange}
            placeholder="Enter email ID"
            required
            type="email"
          />
        </Stack>
        <Button mt="lg" onClick={checkInventory}>
          Check Inventory
        </Button>
        <Divider my="lg" />

        {/* Inventory Table */}
        <Stack>
          <Table>
            <thead>
              <tr>
                <th>Stock Item</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Condition</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.map((item, index) => (
                <tr key={index}>
                  <td>
                    <Select
                      placeholder="Select stock item"
                      value={item.itemName || ''}
                      onChange={(value) => handleSelectChange(value, index, 'itemName')}
                      data={inventoryItemsList.map(item => ({ value: item, label: item }))}
                      required
                    />
                  </td>

                  <td>
                    <Select
                      placeholder="Select category"
                      value={item.category}
                      onChange={(value) => handleSelectChange(value, index, 'category')}
                      data={categories.map(category => ({ value: category, label: category }))}
                      required
                    />
                  </td>

                  <td>
                    <TextInput
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleInputChange(e, index)}
                      placeholder="Enter quantity"
                      required
                    />
                  </td>

                  <td>
                    <Select
                      placeholder="Select unit"
                      name="unit"
                      value={item.unit}
                      onChange={(value) => handleSelectChange(value, index, 'unit')}
                      data={['Units', 'Boxes', 'Liters', 'Beds', 'Bags', 'Sets'].map(unit => ({ value: unit, label: unit }))}
                      required
                    />
                  </td>

                  <td>
                    <SegmentedControl
                      value={item.condition}
                      onChange={(value) => handleConditionChange(value, index)}
                      data={['New', 'Used', 'Damaged']}
                    />
                  </td>

                  <td>{item.priority}</td>

                  <td>
                    <Button variant="light" color="red" onClick={() => setInventoryItems(inventoryItems.filter((_, i) => i !== index))}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Stack>

        {/* Add Stock Item Button */}
        <Group position="center" mt="md">
          <Button onClick={handleAddStockItem}>Add Stock Item</Button>
        </Group>

        {/* Submit Button */}
        <Group position="center" mt="lg">
          <Button onClick={handleSubmit}>Submit Inventory</Button>
        </Group>
      </Card>
    </Container>
  );
};

export default InventoryPage;
