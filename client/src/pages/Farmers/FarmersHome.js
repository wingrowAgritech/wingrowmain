import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

export default function FarmersHome() {
  return (
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",marginTop:"10rem",fontSize:"16px"}}>
    <Box sx={{ width: '100%', maxWidth: 560, bgcolor: 'background.paper',fontSize:"16px" }}>
      <Box sx={{ my: 3, mx: 2 }}>
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography gutterBottom variant="h4" component="div">
              Welcome to the Farmer's Page
            </Typography>
          </Grid>
        </Grid>
        <Typography color="text.secondary" variant="body2">
          Please choose any one option from the following
        </Typography>
      </Box>
      <Divider variant="middle" />
      <Box sx={{ m: 4 }}>
        <Typography gutterBottom variant="body1">
          Select type
        </Typography>
        <Stack direction="row" spacing={5}>
            <Link to={"../inward"}>
                Inward
            </Link>
                <br/>
            <Link to={"../outward"}>
                Outward
             </Link>
        </Stack>
      </Box>
    </Box>
    </div>
  );
}