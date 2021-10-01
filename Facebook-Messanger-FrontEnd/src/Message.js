import React, { forwardRef } from 'react';
import { Card, CardContent, Typography,  } from '@material-ui/core';

const Message = forwardRef(({message,username,isloading},ref)=> {
    if(isloading) {
        return <div style={{textAlign: 'center',color:'red'}}><h1>Lodding....</h1></div>
    }
    const isuser = username === message.username;
    return (
            <Card ref={ref} className={isuser ? 'message_user' : 'message__card'}>
                <CardContent>
                    <Typography style={{textTransform:'capitalize'}}>
                    { !isuser && `${message.username || 'Unknown User' }` }
                    </Typography>
                    <Typography 
                        variant="h6"
                        style={{textTransform:'capitalize'}}
                    >
                        {message.message}
                    </Typography>
                </CardContent>
            </Card>
    )
})

export default Message
