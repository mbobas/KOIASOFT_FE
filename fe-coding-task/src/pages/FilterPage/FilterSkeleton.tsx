import React from 'react';
import Box from '@mui/material/Box';
import { Skeleton } from '@mui/material';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin-bottom: 100px;
`

const FilterSkeleton = () => {
    return (
        <Wrapper>
            <Box sx={{ width: 400, flexDirection: 'column',  display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Skeleton variant="text" sx={{ width: 400, fontSize: '1rem' }} />
                <Skeleton variant="rectangular" width={400} height={60} />
                <Skeleton variant="text" sx={{ width: 400, fontSize: '1rem' }} />
                <Skeleton variant="rectangular" width={400} height={60} />
                <Skeleton variant="text" sx={{ width: 400, fontSize: '1rem' }} />
                <Skeleton variant="rectangular" width={400} height={60} />
                <Skeleton variant="text" sx={{ width: 400, fontSize: '1rem' }} />
                <Skeleton variant="rectangular" width={400} height={60} />
            </Box>
        </Wrapper>
    );
}

export default FilterSkeleton;
