import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from '@mui/material';

export default function DetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:4000/api/records/${id}`)
      .then(res => setRecord(res.data));
  }, [id]);

  if (!record) return <Typography sx={{ mt: 5, textAlign: 'center' }}>Loading...</Typography>;


  const { Brand: brand, _id, __v, ...rest } = record;
  const entries = Object.entries(rest);

  const formatKey = (key) =>
    key.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" fontWeight={700} mb={3} display="flex" alignItems="center">
        🚗 {brand || 'Record Details'}
      </Typography>

      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <TableContainer>
          <Table size="small">
            <TableBody>
              {entries.map(([key, value]) => (
                <TableRow key={key} hover>
                  <TableCell sx={{ fontWeight: 600, py: 1.2, pl: 2, width: '40%' }}>
                    {formatKey(key)}
                  </TableCell>
                  <TableCell sx={{ py: 1.2 }}>{String(value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box mt={4} textAlign="center">
        <Button variant="contained" onClick={() => navigate(-1)}>← Back</Button>
      </Box>
    </Box>
  );
}
