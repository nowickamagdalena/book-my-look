import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import React from 'react';
import axios from 'axios';


const columns = [
    { id: 'name', label: 'Name' },
    { id: 'duration', label: 'Duration' },
    { id: 'price', label: 'Price' },
    { id: 'description', label: 'Description' },
];

const FullOffer = () => {
    const [salonServices, setSalonServices] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    React.useEffect(() => {
        fetchSalonServices().then(r => console.log(r));
    }, []);

    const fetchSalonServices = async () => {
        try {
            const response = await axios.get('http://localhost:8080/salonservices');
            setSalonServices(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="full-offer">
            <h2>Full Offer</h2>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id}>{column.label}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {salonServices
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((service) => (
                                <TableRow key={service.id}>
                                    {columns.map((column) => (
                                        <TableCell key={column.id}>{service[column.id]}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default FullOffer;
