export interface Identity {
  id: string;
  name: string;
}

export interface Role {
  id: string;
  name: string;
}

export interface Permission {
  id: string;
  action: string;
  resource: string;
}

export interface Resource {
  id: string;
  arn: string;
}

export interface AccessEdge {
  from: string;
  to: string;
  relation: string;
}

export interface AccessGraph {
  identities: Identity[];
  roles: Role[];
  permissions: Permission[];
  resources: Resource[];
  edges: AccessEdge[];
}

export function emptyAccessGraph(): AccessGraph {
  return {
    identities: [],
    roles: [],
    permissions: [],
    resources: [],
    edges: [],
  };
}
