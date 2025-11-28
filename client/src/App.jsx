import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './modules/core/context/ThemeContext';
import Layout from './modules/core/components/Layout';
import Dashboard from './modules/core/pages/Dashboard';
import AssetList from './modules/asset/pages/assets/AssetList';
import AssetForm from './modules/asset/pages/assets/AssetForm';
import AssetDetail from './modules/asset/pages/assets/AssetDetail';
import LocationList from './modules/asset/pages/locations/LocationList';
import LocationForm from './modules/asset/pages/locations/LocationForm';
import LocationDetail from './modules/asset/pages/locations/LocationDetail';
import UserList from './modules/asset/pages/users/UserList';
import UserForm from './modules/asset/pages/users/UserForm';
import UserDetail from './modules/asset/pages/users/UserDetail';
import LicenseList from './modules/asset/pages/licenses/LicenseList';
import LicenseForm from './modules/asset/pages/licenses/LicenseForm';
import LicenseDetail from './modules/asset/pages/licenses/LicenseDetail';
import AccessoryList from './modules/asset/pages/accessories/AccessoryList';
import AccessoryForm from './modules/asset/pages/accessories/AccessoryForm';
import AccessoryDetail from './modules/asset/pages/accessories/AccessoryDetail';
import ComponentList from './modules/asset/pages/components/ComponentList';
import ComponentForm from './modules/asset/pages/components/ComponentForm';
import ComponentDetail from './modules/asset/pages/components/ComponentDetail';
import AccountList from './modules/asset/pages/accounts/AccountList';
import AccountForm from './modules/asset/pages/accounts/AccountForm';
import AccountDetail from './modules/asset/pages/accounts/AccountDetail';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assets" element={<AssetList />} />
            <Route path="/assets/create" element={<AssetForm />} />
            <Route path="/assets/edit/:id" element={<AssetForm />} />
            <Route path="/assets/detail/:id" element={<AssetDetail />} />
            <Route path="/locations" element={<LocationList />} />
            <Route path="/locations/create" element={<LocationForm />} />
            <Route path="/locations/edit/:id" element={<LocationForm />} />
            <Route path="/locations/detail/:id" element={<LocationDetail />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/users/create" element={<UserForm />} />
            <Route path="/users/edit/:id" element={<UserForm />} />
            <Route path="/users/detail/:id" element={<UserDetail />} />
            <Route path="/licenses" element={<LicenseList />} />
            <Route path="/licenses/create" element={<LicenseForm />} />
            <Route path="/licenses/edit/:id" element={<LicenseForm />} />
            <Route path="/licenses/detail/:id" element={<LicenseDetail />} />
            <Route path="/accessories" element={<AccessoryList />} />
            <Route path="/accessories/create" element={<AccessoryForm />} />
            <Route path="/accessories/edit/:id" element={<AccessoryForm />} />
            <Route path="/accessories/detail/:id" element={<AccessoryDetail />} />
            <Route path="/components" element={<ComponentList />} />
            <Route path="/components/create" element={<ComponentForm />} />
            <Route path="/components/edit/:id" element={<ComponentForm />} />
            <Route path="/components/detail/:id" element={<ComponentDetail />} />
            <Route path="/accounts" element={<AccountList />} />
            <Route path="/accounts/create" element={<AccountForm />} />
            <Route path="/accounts/edit/:id" element={<AccountForm />} />
            <Route path="/accounts/detail/:id" element={<AccountDetail />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
