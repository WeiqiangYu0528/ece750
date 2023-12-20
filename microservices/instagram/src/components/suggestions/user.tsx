import React, {useContext} from 'react'
import Skeleton from 'react-loading-skeleton'
import UserContext from '../../contexts/user-context'

export default function User() {
  const {user} = useContext(UserContext);
  return (
    <div>
        <div className="grid grid-cols-4 gap-4 mb-6 items-center" data-testid="user">
            <div className='flex items-center justify-between col-span-1'>
                <img className='rounded-full w-16 h-16 flex mr-3'  src={user.avatar} alt="" />
            </div>
            <div className="col-span-3">
                <p className="font-bold text-sm">{user.username}</p>
                <p className="text-sm">{user.fullname}</p>
            
            </div>
        </div>

    </div>
  )
}
