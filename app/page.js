'use client'

import { useState, useEffect } from 'react';
import { Box, Typography, Modal, Stack, TextField, Button, Paper, AppBar, Toolbar } from '@mui/material';
import { collection, query, getDocs, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from '../firebase';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '../app/globals.css';


const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    h2: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
    },
    h3: {
      fontSize: '2rem',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '1rem',
          margin: '1rem',
        },
      },
    },
  },
});

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const incrementItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Pantry Tracker
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        width="100vw"
        height="100vh"
        display={'flex'}
        justifyContent={'center'}
        flexDirection={'column'}
        alignItems={'center'}
        gap={2}
        paddingTop={5}
        bgcolor={'#f0f0f0'}
      >
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Item
            </Typography>
            <Stack width="100%" direction={'row'} spacing={2}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add New Item
        </Button>
        <Paper elevation={3}>
          <Box
            width="800px"
            height="100px"
            bgcolor={'#3f51b5'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Typography variant={'h2'} color={'#fff'} textAlign={'center'}>
              Inventory Items
            </Typography>
          </Box>
          <Stack width="800px" maxHeight="400px" spacing={2} overflow={'auto'} padding={2}>
            {inventory.map(({ name, quantity }) => (
              <Paper key={name} elevation={1}>
                <Box
                  width="100%"
                  minHeight="100px"
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  padding={2}
                >
                  <Typography variant={'h3'} color={'#333'}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant={'h3'} color={'#333'}>
                    Quantity: {quantity}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => incrementItem(name)}
                    >
                      Add
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => removeItem(name)}
                    >
                      Remove
                    </Button>
                  </Stack>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
