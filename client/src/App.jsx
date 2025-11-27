import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AssetList from './pages/AssetList';
import AssetForm from './pages/AssetForm';
import AssetDetail from './pages/AssetDetail';
import LocationList from './pages/LocationList';
import LocationForm from './pages/LocationForm';
import LocationDetail from './pages/LocationDetail';
import UserList from './pages/UserList';
import UserForm from './pages/UserForm';
import UserDetail from './pages/UserDetail';
import Licenses from './pages/Licenses';
import LicenseForm from './pages/LicenseForm';
import LicenseDetail from './pages/LicenseDetail';
import AccessoryList from './pages/AccessoryList';
import AccessoryForm from './pages/AccessoryForm';
import AccessoryDetail from './pages/AccessoryDetail';
import ComponentList from './pages/ComponentList';
import ComponentForm from './pages/ComponentForm';
import ComponentDetail from './pages/ComponentDetail';
import AccountList from './pages/AccountList';
import AccountForm from './pages/AccountForm';
import AccountDetail from './pages/AccountDetail';

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
            <Route path="/licenses" element={<Licenses />} />
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
