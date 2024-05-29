import * as React from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { DayPicker } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/custom/button'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames: _classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const classNames = {
    months: cn('flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0'),
    month: cn('space-y-4'),
    caption: cn('flex justify-center pt-1 relative items-center'),
    caption_label: cn('text-sm font-medium'),
    nav: cn('space-x-1 flex items-center'),
    nav_button: cn(
      buttonVariants({ variant: 'outline' }),
      'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
    ),
    nav_button_previous: cn('absolute left-1'),
    nav_button_next: cn('absolute right-1'),
    table: cn('w-full border-collapse space-y-1'),
    head_row: cn('flex'),
    head_cell:
      cn('text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]'),
    row: cn('flex w-full mt-2'),
    cell: cn(
      'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
      props.mode === 'range'
        ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
        : '[&:has([aria-selected])]:rounded-md'
    ),
    day: cn(
      buttonVariants({ variant: 'ghost' }),
      'h-8 w-8 p-0 font-normal aria-selected:opacity-100'
    ),
    day_range_start: cn('day-range-start'),
    day_range_end: cn('day-range-end'),
    day_selected:
      cn('bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground'),
    day_today: cn('bg-accent text-accent-foreground'),
    day_outside:
      cn('day-outside text-muted-foreground opacity-50  aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30'),
    day_disabled: cn('text-muted-foreground opacity-50'),
    day_range_middle:
      cn('aria-selected:bg-accent aria-selected:text-accent-foreground'),
    day_hidden: cn('invisible'),
    ..._classNames,
  }
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={classNames}
      components={{
        IconLeft: () => <ChevronLeftIcon className='h-4 w-4' />,
        IconRight: () => <ChevronRightIcon className='h-4 w-4' />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
