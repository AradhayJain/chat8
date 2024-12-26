// import { Box } from '@chakra-ui/react'
import React from 'react'
import "/src/css/badge.css"

const UserBadgeItem = ({ user, handleFunction}) => {
  return (
    <button className='by'
      onClick={handleFunction}
    >
      {user.name}
    </button>
  )
}

export default UserBadgeItem