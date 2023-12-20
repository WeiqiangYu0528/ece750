import React from 'react'
import SuggestedProfiles from './suggested-profiles'
import User from './user'
import { recommendedUserType } from '../../pages/pageType'

export default function Suggestions(props: {recommendedUsers: recommendedUserType[]}) {
  return (
    <div className='mx-20 col-span-2 max-w-xs mt-10' data-testid="suggestions">
    <User/>
    <SuggestedProfiles recommendedUsers={props.recommendedUsers} />
    </div>
  )
}
