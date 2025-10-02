import React from 'react';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import {getRandomInterviewCover} from "@/lib/utils";
import { Button } from './ui/button';
import DisplayTechIcons from './displayTechIcons';

interface Feedback {
  createdAt: string;
  // Add other properties as needed
}

interface InterviewCardProps {
  interviewId: string;
  userId: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt: string;
}

const InterviewCard = ({interviewId, userId, role, type, techstack, createdAt}: InterviewCardProps) => {

    const feedback = null as Feedback | null;
    const normalizedType = /mix/gi.test(type) ? 'Mixed' : type;
    const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format('MMM D, YYYY')

    return (

        <div className ='card-border w-[360px] max-sm:w-full min-h-96'>
            <div className = 'card-interview'>
                <div>
                    <div className = 'absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600'>
                        <p className = 'badge-text'>{ normalizedType }</p>
                    </div>

                    <Image src = {getRandomInterviewCover()} alt = "cover-image" width = {90} height = {90} className = 'rounded-full object-fill size-[90px]'/>
                    
                    <h3 className = "mt-5 capitalize">
                        { role } Interview
                    </h3>

                    <div className = "flex flex-row gap-5 mt-3" >
                        <div className = "flex flex-row gap-2">
                            <Image src = "/calendar.svg" alt = "calender" width={22} height={22}/>
                            <p>{ formattedDate }</p>
                        </div>
                    

                         <div className = " flex flex-row gap-2 items-center">
                            <Image src = "/star.svg" alt = "feedback-star" width={22} height={22}/>
                            <p>{ feedback?.totalScore || '---'}/100</p>
                        </div>
                    </div>

                    <p className = "line-clamp-2 mt-5">
                        {feedback?.finalAssessment || "You have not given any Interviews yet. Wanna take it now :D"}
                    </p>

                </div>

                <div className = "flex flex-row justify-between">
                    <DisplayTechIcons techstack={ techstack } />
                    <Button className = "btn-primary">
                        <Link href = { feedback ? `/interview/${interviewId}/feedback` : `/interview/${interviewId}`}>
                            { feedback ? 'Check Feedback' : 'See Interview'}
                        </Link>
                    </Button>
                </div>

            </div>
        </div>

    );
};

export default InterviewCard;