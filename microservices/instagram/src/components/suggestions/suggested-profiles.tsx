import React from 'react'
import SuggestedProfile from './suggested-profile'
import { recommendedUserType } from '../../pages/pageType'

export default function SuggestedProfiles(props: {recommendedUsers: recommendedUserType[]}) {
  return (
    <div>
        <div className="rounded flex flex-col" data-testid="profiles">
            <div className="text-sm flex items-center align-items justify-between mb-2">
                <p className="font-bold text-gray-base">Suggestions for you</p>
            </div>
            <div className="mt-4 grid gap-5">
            {props.recommendedUsers.map((user: recommendedUserType, idx) => (<SuggestedProfile key={idx} recommendedUser={user}/>))}
            </div>
        </div>
    </div>
  )
}
