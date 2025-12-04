import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './modules/core/context/ThemeContext';
import { AuthProvider } from './modules/core/context/AuthContext';
import Layout from './modules/core/components/Layout';
import PublicLayout from './modules/core/components/PublicLayout';
import ProtectedRoute from './modules/core/components/ProtectedRoute';
import PermissionRoute from './modules/core/components/PermissionRoute';
import Login from './modules/core/pages/Login';
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

import ModuleSelection from './modules/core/pages/ModuleSelection';

import RoleList from './modules/sysadmin/pages/RoleList';
import RoleForm from './modules/sysadmin/pages/RoleForm';
import PermissionList from './modules/sysadmin/pages/PermissionList';
import PermissionForm from './modules/sysadmin/pages/PermissionForm';
import UserManagement from './modules/sysadmin/pages/UserManagement';

import { LayoutProvider } from './modules/core/context/LayoutContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LayoutProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />

              {/* Public Scan Routes */}
              <Route path="/scan/assets/:id" element={
                <PublicLayout>
                  <AssetDetail />
                </PublicLayout>
              } />
              <Route path="/scan/licenses/:id" element={
                <PublicLayout>
                  <LicenseDetail />
                </PublicLayout>
              } />
              <Route path="/scan/accessories/:id" element={
                <PublicLayout>
                  <AccessoryDetail />
                </PublicLayout>
              } />
              <Route path="/scan/components/:id" element={
                <PublicLayout>
                  <ComponentDetail />
                </PublicLayout>
              } />
              <Route path="/scan/accounts/:id" element={
                <PublicLayout>
                  <AccountDetail />
                </PublicLayout>
              } />
              <Route path="/scan/locations/:id" element={
                <PublicLayout>
                  <LocationDetail />
                </PublicLayout>
              } />
              <Route path="/scan/users/:id" element={
                <PublicLayout>
                  <UserDetail />
                </PublicLayout>
              } />

              <Route path="/modules" element={
                <ProtectedRoute>
                  <ModuleSelection />
                </ProtectedRoute>
              } />
              <Route path="/*" element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />

                      {/* Asset Routes */}
                      <Route path="/assets" element={
                        <PermissionRoute permission="assets.read">
                          <AssetList />
                        </PermissionRoute>
                      } />
                      <Route path="/assets/create" element={
                        <PermissionRoute permission="assets.create">
                          <AssetForm />
                        </PermissionRoute>
                      } />
                      <Route path="/assets/edit/:id" element={
                        <PermissionRoute permission="assets.update">
                          <AssetForm />
                        </PermissionRoute>
                      } />
                      <Route path="/assets/detail/:id" element={
                        <PermissionRoute permission="assets.read">
                          <AssetDetail />
                        </PermissionRoute>
                      } />

                      {/* Location Routes */}
                      <Route path="/locations" element={
                        <PermissionRoute permission="locations.read">
                          <LocationList />
                        </PermissionRoute>
                      } />
                      <Route path="/locations/create" element={
                        <PermissionRoute permission="locations.create">
                          <LocationForm />
                        </PermissionRoute>
                      } />
                      <Route path="/locations/edit/:id" element={
                        <PermissionRoute permission="locations.update">
                          <LocationForm />
                        </PermissionRoute>
                      } />
                      <Route path="/locations/detail/:id" element={
                        <PermissionRoute permission="locations.read">
                          <LocationDetail />
                        </PermissionRoute>
                      } />

                      {/* User Routes */}
                      <Route path="/users" element={
                        <PermissionRoute permission="users.read">
                          <UserList />
                        </PermissionRoute>
                      } />
                      <Route path="/users/create" element={
                        <PermissionRoute permission="users.create">
                          <UserForm />
                        </PermissionRoute>
                      } />
                      <Route path="/users/edit/:id" element={
                        <PermissionRoute permission="users.update">
                          <UserForm />
                        </PermissionRoute>
                      } />
                      <Route path="/users/detail/:id" element={
                        <PermissionRoute permission="users.read">
                          <UserDetail />
                        </PermissionRoute>
                      } />

                      {/* License Routes */}
                      <Route path="/licenses" element={
                        <PermissionRoute permission="licenses.read">
                          <LicenseList />
                        </PermissionRoute>
                      } />
                      <Route path="/licenses/create" element={
                        <PermissionRoute permission="licenses.create">
                          <LicenseForm />
                        </PermissionRoute>
                      } />
                      <Route path="/licenses/edit/:id" element={
                        <PermissionRoute permission="licenses.update">
                          <LicenseForm />
                        </PermissionRoute>
                      } />
                      <Route path="/licenses/detail/:id" element={
                        <PermissionRoute permission="licenses.read">
                          <LicenseDetail />
                        </PermissionRoute>
                      } />

                      {/* Accessory Routes */}
                      <Route path="/accessories" element={
                        <PermissionRoute permission="accessories.read">
                          <AccessoryList />
                        </PermissionRoute>
                      } />
                      <Route path="/accessories/create" element={
                        <PermissionRoute permission="accessories.create">
                          <AccessoryForm />
                        </PermissionRoute>
                      } />
                      <Route path="/accessories/edit/:id" element={
                        <PermissionRoute permission="accessories.update">
                          <AccessoryForm />
                        </PermissionRoute>
                      } />
                      <Route path="/accessories/detail/:id" element={
                        <PermissionRoute permission="accessories.read">
                          <AccessoryDetail />
                        </PermissionRoute>
                      } />

                      {/* Component Routes */}
                      <Route path="/components" element={
                        <PermissionRoute permission="components.read">
                          <ComponentList />
                        </PermissionRoute>
                      } />
                      <Route path="/components/create" element={
                        <PermissionRoute permission="components.create">
                          <ComponentForm />
                        </PermissionRoute>
                      } />
                      <Route path="/components/edit/:id" element={
                        <PermissionRoute permission="components.update">
                          <ComponentForm />
                        </PermissionRoute>
                      } />
                      <Route path="/components/detail/:id" element={
                        <PermissionRoute permission="components.read">
                          <ComponentDetail />
                        </PermissionRoute>
                      } />

                      {/* Account Routes */}
                      <Route path="/accounts" element={
                        <PermissionRoute permission="accounts.read">
                          <AccountList />
                        </PermissionRoute>
                      } />
                      <Route path="/accounts/create" element={
                        <PermissionRoute permission="accounts.create">
                          <AccountForm />
                        </PermissionRoute>
                      } />
                      <Route path="/accounts/edit/:id" element={
                        <PermissionRoute permission="accounts.update">
                          <AccountForm />
                        </PermissionRoute>
                      } />
                      <Route path="/accounts/detail/:id" element={
                        <PermissionRoute permission="accounts.read">
                          <AccountDetail />
                        </PermissionRoute>
                      } />

                      {/* System Admin Routes */}
                      <Route path="/sysadmin/roles" element={
                        <PermissionRoute permission="roles.read">
                          <RoleList />
                        </PermissionRoute>
                      } />
                      <Route path="/sysadmin/roles/create" element={
                        <PermissionRoute permission="roles.create">
                          <RoleForm />
                        </PermissionRoute>
                      } />
                      <Route path="/sysadmin/roles/edit/:id" element={
                        <PermissionRoute permission="roles.update">
                          <RoleForm />
                        </PermissionRoute>
                      } />
                      <Route path="/sysadmin/permissions" element={
                        <PermissionRoute permission="permissions.read">
                          <PermissionList />
                        </PermissionRoute>
                      } />
                      <Route path="/sysadmin/permissions/create" element={
                        <PermissionRoute permission="permissions.create">
                          <PermissionForm />
                        </PermissionRoute>
                      } />
                      <Route path="/sysadmin/permissions/edit/:id" element={
                        <PermissionRoute permission="permissions.update">
                          <PermissionForm />
                        </PermissionRoute>
                      } />
                      <Route path="/sysadmin/users" element={
                        <PermissionRoute permission="users.update">
                          <UserManagement />
                        </PermissionRoute>
                      } />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </LayoutProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
