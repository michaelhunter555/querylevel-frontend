import React from 'react';

import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export const ShoppingInputsLoading = () => {
  return (
    <>
      <Paper elevation={1} sx={{ borderRadius: "15px", width: "100%" }}>
        <Grid
          container
          direction="row"
          sx={{ margin: "2rem auto" }}
          spacing={3}
        >
          <Grid item xs={12} md={4}>
            <Skeleton
              sx={{ margin: "0 auto", borderRadius: 10 }}
              variant="rectangular"
              width={250}
              height={250}
            />
            <Skeleton variant="text" width="100%" height={40} />
            <Divider />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="80%" />
          </Grid>

          <Divider orientation="vertical" flexItem sx={{ margin: "0 1rem" }} />

          <Grid item xs={12} md={7}>
            <Grid container direction="row" spacing={1}>
              <Grid item xs={12}>
                <Typography>Campaign Structure</Typography>
                <Stack direction="row" alignItems="center" spacing={2}>
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      width="100%"
                      height={175}
                      sx={{ borderRadius: 5 }}
                    />
                  ))}
                </Stack>
                <Divider sx={{ margin: "1rem auto" }} />
              </Grid>
              {/**Brand Name: string */}
              <Grid item xs={12}>
                <Typography>Brand Name</Typography>
                <Typography variant="h5" color="text.secondary">
                  <Skeleton width="25%" />
                </Typography>
              </Grid>
              {/**Ad Schedule: [{},] */}
              <Grid item xs={12}>
                <Skeleton width="100%" />
              </Grid>

              {/**targeted locations: string[] */}
              <Grid item xs={5}>
                <Skeleton width="100%" height={90} />
              </Grid>

              {/**excluded locations: string[]*/}
              <Grid item xs={5}>
                <Skeleton width="100%" height={90} />
              </Grid>

              {/** shared budget:number */}
              <Grid item xs={12} lg={5}>
                <Skeleton width="100%" height={90} />
              </Grid>

              {/*CPC bids: number */}
              <Grid item xs={12} lg={5}>
                <Skeleton width="100%" height={90} />
              </Grid>

              {/**Bid separation: number */}
              <Grid item xs={12} sx={{ display: "flex", gap: "5px" }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Chip key={i} component={Skeleton} label="50%" />
                ))}
              </Grid>

              {/**campaigns enabled: boolean */}
              <Grid item xs={12}>
                <Skeleton width="100%" />
              </Grid>
            </Grid>
            <Stack sx={{ margin: "1rem auto" }}>
              <Skeleton width="100%" />
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};
