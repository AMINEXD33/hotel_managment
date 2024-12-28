
import Image from "next/image"
import BedIcon from '@mui/icons-material/Bed';
import ShowerIcon from '@mui/icons-material/Shower';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import Rating from '@mui/material/Rating';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { styled } from '@mui/material/styles';
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
  }));

export default function RoomsDispUser({
    src,
    beds,
    showers,
    price,
    roomDescription,
    roomPhotos,
    roomRating,
    hotelName,
    hotelId
}){







    return(
        <div className="shipRooms">
            <Image
                src={src}
                height={450}
                width={450}
                // layout="responsive"
                alt="roomPhotos"
                style={{borderRadius:"10px"}}
            />
            <div className="infos">
                <div className="info">
                    <BedIcon  color="action"/>
                    {beds}
                </div>
                <div className="info">
                    <ShowerIcon  color="action"/>
                    {showers}
                </div>
                <div className="info">
                    <LocalOfferIcon color="action"/>
                    {price}/h
                </div>
                <div className="info">
                    <CorporateFareIcon color="action"/>
                    {hotelName}
                </div>
                <div className="infonoEffect">
                    <Rating name="half-rating" defaultValue={roomRating} precision={0.5} readOnly/>
                </div>
                
            </div>


            <div className="infos">
            <div className="infonoEffect">
                    <h5>description</h5>
                </div>
                <div className="infonoEffect descrip">
                    {roomDescription}
                </div>
            </div>
            <div className="infos">
            <Stack direction="row" spacing={2}>
            <Button color="secondary">more information</Button>
            <Button variant="contained" color="success">
                Reserve Now !
            </Button>
            </Stack>
           
            </div>
        </div>
    )
}