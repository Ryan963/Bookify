import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { approveCompany } from '../../pages/admin/AdminHome'

export const MenuItem =  ({name, onClick}) => { //imports into as other components and then use it 
// name and on click are the props
  return (
    <Menu.Item>
    {({ active }) => (
      <p
        
        onClick= {console.log("hello")}
        className={classNames(
          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
          'block px-4 py-2 text-sm'
        )}
      >
        {name} 
      </p>
    )}
  </Menu.Item>
  


  )
} // anon function saving it in a variable 

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function DropDown({children}) { // pass prop through here all the menu items should be passed as the children of the menu item 
  return (
    <Menu as="div" className="relative inline-block text-left"> 
      <div>
    
        <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-lightblue focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 ">
          Options
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      > 
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
         {children}
            
      
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}