






// withAuth.tsx (HOC)
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

// Define the allowed roles explicitly
type Role = 'admin' | 'staff' | 'student';

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: Role[] = []
): React.FC<P> => {
  return (props: P) => {
    const [authState, setAuthState] = useState({ isAuthenticated: false, loading: true });
    const router = useRouter();
    
  

    useEffect(() => {
      const verifyToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        try {
          const decoded: { exp?: number } = jwtDecode(token); // Ensure `exp` is optional
          // Check expiration if `exp` exists
          if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            router.push('/login');
            return;
          }

          const role = localStorage.getItem('role');
          if (allowedRoles.length && role && !allowedRoles.includes(role as Role)) {
            // router.push('/unauthorized');
            const rolePaths = {
              admin: "/admin",
              staff: "/staff",
               student: "/student",
            };
            router.push(rolePaths[role as keyof typeof rolePaths] || "/unauthorized");
            return;
          }
          setAuthState({ isAuthenticated: true, loading: false });
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          router.push('/login');
        }
      };

      verifyToken();
    }, [router]);

    if (authState.loading) {
      return (<div>
        {/* Loading... */}
        <div className="app-preloader fixed z-50 grid h-full w-full place-content-center bg-slate-50 dark:bg-navy-900">
          {/* <div className="app-preloader-inner relative inline-block size-48" /> */}
          <div className="relative inline-block size-48" />
        </div>
        </div>
    )}

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;






