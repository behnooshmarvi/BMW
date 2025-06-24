import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './DataGridTable.css';
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  Fade,
  CircularProgress,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

import { getAllRecords, deleteRecord, searchRecords, filterRecords } from '../api/api';
import { ModuleRegistry } from 'ag-grid-community';
import { AllCommunityModule } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

export default function DataGridTable() {
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterField, setFilterField] = useState('');
  const [filterOperator, setFilterOperator] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width:800px)');

  const handleDelete = async (id) => {
    try {
      await deleteRecord(id);
      setRowData((prev) => prev.filter((row) => row._id !== id));
    } catch (err) {
      console.error('Delete Error:', err);
    }
  };

  const applySearchAndFilter = () => {
    const trimmedSearch = searchTerm.trim();
    const useSearch = trimmedSearch !== '';
    const useFilter = filterField && (filterValue || filterOperator === 'is_empty');

    setLoading(true);

    const final = () => setLoading(false);

    if (useSearch && !useFilter) {
      searchRecords(trimmedSearch)
        .then(res => setRowData(res.data))
        .catch(console.error)
        .finally(final);
      return;
    }
    if (!useSearch && useFilter) {
      filterRecords(filterField, filterOperator, filterValue)
        .then(res => setRowData(res.data))
        .catch(console.error)
        .finally(final);
      return;
    }
    if (useSearch && useFilter) {
      filterRecords(filterField, filterOperator, filterValue)
        .then(res => {
          const lowerSearch = trimmedSearch.toLowerCase();
          const searched = res.data.filter(r =>
            Object.values(r).some(val => typeof val === 'string' && val.toLowerCase().includes(lowerSearch))
          );
          setRowData(searched);
        })
        .catch(console.error)
        .finally(final);
      return;
    }
    getAllRecords().then(res => setRowData(res.data)).finally(final);
  };

  const handleApplyFilter = () => applySearchAndFilter();

  const handleResetFilter = () => {
    setSearchTerm('');
    setFilterField('');
    setFilterOperator('contains');
    setFilterValue('');
    setLoading(true);
    getAllRecords().then(res => setRowData(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    const handleView = (id) => navigate(`/details/${id}`);
    getAllRecords()
      .then((res) => {
        const data = res.data;
        if (data.length > 0) {
          const keys = Object.keys(data[0]).filter((k) => k !== '__v' && k !== '_id');
          const cols = [
            {
              headerName: '#',
              valueGetter: (params) => params.node.rowIndex + 1,
              width: 60,
              pinned: 'left'
            },
...keys.map((k) => ({
  field: k,
  headerName: k.toUpperCase(),
  sortable: false,
  filter: false,
  tooltipValueGetter: (params) => {
    const value = params.value;
    return typeof value === 'string' && value.length > 20 ? value : null;
  },
  callRenderer: (params) => {
    const value = params.value;
    if (typeof value === 'string') {
      const maxLen = 20;
      const short = value.length > maxLen ? value.slice(0, maxLen) + '…' : value;

      return (
        <div
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '180px',
          }}
        >
          {short}
        </div>
      );
    }
    return <span>{value}</span>;
  },
}))
,
            {
              headerName: 'Actions',
              field: 'actions',
              pinned: isSmallScreen ? undefined : 'right',
              width: isSmallScreen ? 80 : 160,
              cellRenderer: (params) => (
                
                <Fade in={true} timeout={500}>
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    {isSmallScreen ? (
                      <Stack direction="row" spacing={1}>
                        <VisibilityIcon color="primary" sx={{ cursor: 'pointer' }} fontSize="small" onClick={() => handleView(params.data._id)} />
                        <DeleteIcon color="error" sx={{ cursor: 'pointer' }} fontSize="small" onClick={() => handleDelete(params.data._id)} />
                      </Stack>
                    ) : (
                      <Stack direction="row" spacing={1}>
                        <Button size="small" variant="contained" color="primary" onClick={() => handleView(params.data._id)}>
                          View
                        </Button>
                        <Button size="small" variant="contained" color="error" onClick={() => handleDelete(params.data._id)}>
                          Delete
                        </Button>
                      </Stack>
                    )}
                  </Box>
                </Fade>
              )
            }
          ];
          setColumnDefs(cols);
          setRowData(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [navigate, isSmallScreen]);

  useEffect(() => {
    applySearchAndFilter();
    // eslint-disable-next-line
  }, [searchTerm]);

  return (
    <>
    <Paper elevation={1} sx={{ p: 3, borderRadius: 3, backgroundColor: '#fff' }}>
      <Typography variant="h5" fontWeight={600} mb={3} sx={{ fontFamily: 'monospace' }}>
        🚗 Cars Data Table
      </Typography>

      <Stack spacing={2} mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="🔍 Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{
            '& .MuiInputBase-root': { height: 42, fontSize: '0.95rem' },
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
          }}
        />

        <Stack
          direction={isSmallScreen ? 'column' : 'row'}
          spacing={2}
          alignItems="center"
          flexWrap="wrap"
          sx={{
            '& .MuiTextField-root': { minWidth: isSmallScreen ? '100%' : 150 },
            '& .MuiButton-root': { width: isSmallScreen ? '100%' : 'auto' }
          }}
        >
          {[{
            label: 'Field',
            value: filterField,
            onChange: (e) => setFilterField(e.target.value),
            select: true,
            options: columnDefs.filter(col => col.field && col.field !== 'actions')
              .map(col => ({ value: col.field, label: col.headerName }))
          }, {
            label: 'Operator',
            value: filterOperator,
            onChange: (e) => setFilterOperator(e.target.value),
            select: true,
            options: [
              { value: 'contains', label: 'contains' },
              { value: 'equals', label: 'equals' },
              { value: 'starts_with', label: 'starts with' },
              { value: 'ends_with', label: 'ends with' },
              { value: 'is_empty', label: 'is empty' }
            ]
          }, {
            label: 'Value',
            value: filterValue,
            onChange: (e) => setFilterValue(e.target.value),
            select: false
          }].map((item, index) => (
            <TextField
              key={index}
              label={item.label}
              value={item.value}
              onChange={item.onChange}
              select={item.select}
              size="small"
              sx={{ minWidth: 160, '& .MuiInputBase-root': { height: 42, fontSize: '0.9rem' } }}
            >
              {item.select && item.options.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
          ))}

          <Button variant="contained" size="small" onClick={handleApplyFilter} sx={{ height: 42 }}>Apply</Button>
          <Button variant="outlined" size="small" onClick={handleResetFilter} sx={{ height: 42 }}>Reset</Button>
        </Stack>
      </Stack>

      <Box className="ag-theme-alpine" sx={{ width: '100%' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={5}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <AgGridReact
          tooltipShowDelay={0}
            rowData={rowData}
            columnDefs={columnDefs}
            pagination
            domLayout="autoHeight"
            paginationPageSize={20}
            getRowHeight={() => 52}
            headerHeight={52}
            defaultColDef={{
              sortable: false,
              filter: false,
              suppressMenu: true,
              suppressSorting: true,
              suppressFilter: true,
              cellClass: 'ag-left-text',
              headerClass: 'ag-left-header'
            }}
            enableCellTextSelection={true}

          />
        )}
      </Box>
      
    </Paper>
    <Box 
        sx={{
          backgroundColor: '#1976d2', 
          py: 2, 
          textAlign: 'center', 
          width: '100%',  
          marginTop: 'auto',  
          position: 'relative', 
          bottom: 0, 
        }}
      >
        <Typography variant="body2" color="white" sx={{ fontFamily: 'monospace' }}>
          Crafted with 💻 by Behnoosh Marvi
        </Typography>
        <Typography variant="caption" color="white">
          All Rights Reserved &copy; {new Date().getFullYear()}
        </Typography>
      </Box>
      </>
  );
}
