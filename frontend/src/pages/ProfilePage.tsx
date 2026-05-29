import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/userService";
import { vehicleService } from "../services/vehicleService";
import { challengeService } from "../services/challengeService";
import type { CreateVehicleRequest, UpdateVehicleRequest } from "../services/vehicleService";
import type { UserProfile, Vehicle, Challenge } from "../types/dashboard.types";

import fondoPerfil from "../assets/backgrounds/FondoPerfi.jpg";
import logoRatRace from "../assets/logos/logoRatRace.png";
import "./ProfilePage.css";

interface ProfileForm {
  username: string;
  profilePhoto: string;
  locality: string;
  city: string;
  state: string;
  country: string;
}

interface VehicleForm {
  vehicleType: string;
  brand: string;
  model: string;
  year: string;
  color: string;
  plate: string;
  photo: string;
  modifications: string;
  active: boolean;
}

const EMPTY_VEHICLE_FORM: VehicleForm = {
  vehicleType: "motorcycle",
  brand: "",
  model: "",
  year: new Date().getFullYear().toString(),
  color: "",
  plate: "",
  photo: "",
  modifications: "",
  active: false,
};

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: authUser, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    username: "",
    profilePhoto: "",
    locality: "",
    city: "",
    state: "",
    country: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehicleForm, setVehicleForm] = useState<VehicleForm>(EMPTY_VEHICLE_FORM);
  const [vehicleSaving, setVehicleSaving] = useState(false);
  const [vehicleError, setVehicleError] = useState("");

  const [deletingVehicleId, setDeletingVehicleId] = useState<string | null>(null);
  const [activatingVehicleId, setActivatingVehicleId] = useState<string | null>(null);

  const isMe = authUser?.id === id;

  const loadProfile = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const profileRes = isMe
        ? await userService.getMyProfile()
        : await userService.getUserProfile(id);

      if (profileRes.success && profileRes.data) {
        setProfile(profileRes.data);
      } else {
        setError("No se pudo cargar el perfil");
        return;
      }

      if (isMe) {
        try {
          const vehiclesRes = await vehicleService.getMyVehicles();
          if (vehiclesRes.success && vehiclesRes.data) {
            setVehicles(vehiclesRes.data);
          }
        } catch {
          //
        }

        try {
          const challengesRes = await challengeService.getMyChallenges();
          if (challengesRes.success && challengesRes.data) {
            setChallenges(challengesRes.data);
          }
        } catch {
          //
        }
      }
    } catch {
      setError("Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  }, [id, isMe]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const openEditProfile = () => {
    if (!profile) return;
    setProfileForm({
      username: profile.username,
      profilePhoto: profile.profilePhoto || "",
      locality: profile.locality || "",
      city: profile.city || "",
      state: profile.state || "",
      country: profile.country || "",
    });
    setProfileError("");
    setShowEditProfile(true);
  };

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    setProfileError("");
    try {
      const res = await userService.updateMyProfile({
        username: profileForm.username,
        profilePhoto: profileForm.profilePhoto || undefined,
        locality: profileForm.locality || undefined,
        city: profileForm.city || undefined,
        state: profileForm.state || undefined,
        country: profileForm.country || undefined,
      });
      if (res.success && res.data) {
        setProfile(res.data);
        await refreshProfile();
        setShowEditProfile(false);
      } else {
        setProfileError(res.error || "Error al actualizar perfil");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Error al actualizar perfil";
      setProfileError(msg);
    } finally {
      setProfileSaving(false);
    }
  };

  const openCreateVehicle = () => {
    setEditingVehicle(null);
    setVehicleForm(EMPTY_VEHICLE_FORM);
    setVehicleError("");
    setShowVehicleModal(true);
  };

  const openEditVehicle = (v: Vehicle) => {
    setEditingVehicle(v);
    setVehicleForm({
      vehicleType: v.vehicleType,
      brand: v.brand,
      model: v.model,
      year: v.year.toString(),
      color: v.color,
      plate: v.plate || "",
      photo: v.photo || "",
      modifications: v.modifications || "",
      active: v.active,
    });
    setVehicleError("");
    setShowVehicleModal(true);
  };

  const handleSaveVehicle = async () => {
    if (!vehicleForm.brand || !vehicleForm.model || !vehicleForm.color) {
      setVehicleError("Marca, modelo y color son obligatorios");
      return;
    }

    setVehicleSaving(true);
    setVehicleError("");

    try {
      if (editingVehicle) {
        const data: UpdateVehicleRequest = {
          vehicleType: vehicleForm.vehicleType,
          brand: vehicleForm.brand,
          model: vehicleForm.model,
          year: parseInt(vehicleForm.year) || new Date().getFullYear(),
          color: vehicleForm.color,
          plate: vehicleForm.plate || undefined,
          photo: vehicleForm.photo || undefined,
          modifications: vehicleForm.modifications || undefined,
        };
        const res = await vehicleService.update(editingVehicle.id, data);
        if (res.success) {
          await reloadVehicles();
          setShowVehicleModal(false);
        } else {
          setVehicleError(res.error || "Error al actualizar vehículo");
        }
      } else {
        const data: CreateVehicleRequest = {
          vehicleType: vehicleForm.vehicleType,
          brand: vehicleForm.brand,
          model: vehicleForm.model,
          year: parseInt(vehicleForm.year) || new Date().getFullYear(),
          color: vehicleForm.color,
          plate: vehicleForm.plate || undefined,
          photo: vehicleForm.photo || undefined,
          modifications: vehicleForm.modifications || undefined,
          active: vehicleForm.active,
        };
        const res = await vehicleService.create(data);
        if (res.success) {
          await reloadVehicles();
          setShowVehicleModal(false);
        } else {
          setVehicleError(res.error || "Error al crear vehículo");
        }
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Error al guardar vehículo";
      setVehicleError(msg);
    } finally {
      setVehicleSaving(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    setDeletingVehicleId(vehicleId);
    try {
      const res = await vehicleService.remove(vehicleId);
      if (res.success) {
        await reloadVehicles();
      }
    } catch {
      //
    } finally {
      setDeletingVehicleId(null);
    }
  };

  const handleSetActive = async (vehicleId: string) => {
    setActivatingVehicleId(vehicleId);
    try {
      const res = await vehicleService.setActive(vehicleId);
      if (res.success) {
        await reloadVehicles();
      }
    } catch {
      //
    } finally {
      setActivatingVehicleId(null);
    }
  };

  const reloadVehicles = async () => {
    try {
      const vehiclesRes = await vehicleService.getMyVehicles();
      if (vehiclesRes.success && vehiclesRes.data) {
        setVehicles(vehiclesRes.data);
      }
    } catch {
      //
    }
  };

  const buildLocation = () => {
    if (!profile) return null;
    const parts = [profile.locality, profile.city, profile.state, profile.country].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : null;
  };

  const getWinRate = () => {
    if (!profile) return 0;
    const total = profile.wins + profile.losses;
    if (total === 0) return 0;
    return Math.round((profile.wins / total) * 100);
  };

  const getStatusClass = (status: string) => {
    const map: Record<string, string> = {
      pending: "status-pending",
      accepted: "status-accepted",
      in_progress: "status-in_progress",
      completed: "status-completed",
      rejected: "status-rejected",
      canceled: "status-canceled",
      disputed: "status-disputed",
    };
    return map[status] || "";
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      pending: "Pendiente",
      accepted: "Aceptado",
      in_progress: "En curso",
      completed: "Completado",
      rejected: "Rechazado",
      canceled: "Cancelado",
      disputed: "Disputado",
    };
    return map[status] || status;
  };

  const getRivalName = (c: Challenge) => {
    if (!authUser) return "—";
    if (c.challengerId === authUser.id) return c.challengedName || "Rival";
    return c.challengerName || "Rival";
  };

  const location = buildLocation();

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-bg" style={{ backgroundImage: `url(${fondoPerfil})` }}>
          <div className="profile-bg-overlay" />
        </div>
        <div className="profile-loading">
          <div className="profile-spinner" />
          <span className="profile-loading-text">Cargando perfil...</span>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="profile-page">
        <div className="profile-bg" style={{ backgroundImage: `url(${fondoPerfil})` }}>
          <div className="profile-bg-overlay" />
        </div>
        <div className="profile-error">
          <span className="profile-error-text">{error || "Piloto no encontrado"}</span>
          <Link to="/dashboard" className="profile-error-link">
            Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-bg" style={{ backgroundImage: `url(${fondoPerfil})` }}>
        <div className="profile-bg-overlay" />
      </div>

      <nav className="profile-topbar">
        <div className="profile-topbar-left">
          <Link to="/dashboard" className="profile-back-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Dashboard
          </Link>
          <img src={logoRatRace} alt="RatRace" className="profile-topbar-logo" />
        </div>
      </nav>

      <div className="profile-content">
        <div className="profile-hero">
          <div className="profile-avatar-container">
            <div className="profile-avatar-ring">
              {profile.profilePhoto ? (
                <img
                  src={profile.profilePhoto}
                  alt={profile.username}
                  className="profile-avatar-img"
                />
              ) : (
                <div className="profile-avatar-fallback">
                  {profile.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className={`profile-rank-badge-floating profile-rank-badge-${profile.rank}`}>
              {profile.rank}
            </div>
          </div>

          <h1 className="profile-username">{profile.username}</h1>

          <span className={`profile-rank-label profile-rank-${profile.rank}`}>
            Rango {profile.rank}
          </span>

          {isMe && (
            <span className="profile-is-me-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Mi perfil
            </span>
          )}

          {location && (
            <div className="profile-location">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {location}
            </div>
          )}

          {isMe && (
            <div className="profile-actions-bar">
              <button
                className="profile-action-btn profile-action-btn--edit"
                onClick={openEditProfile}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Editar perfil
              </button>
            </div>
          )}

          {!isMe && (
            <div className="profile-actions-bar">
              <button
                className="profile-action-btn profile-action-btn--challenge"
                onClick={() => navigate("/dashboard", { state: { challengeTarget: { id: profile.id, username: profile.username } } })}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
                Retar
              </button>
              <button
                className="profile-action-btn profile-action-btn--message"
                onClick={() => navigate("/dashboard", { state: { openChatUserId: profile.id } })}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
                Mensaje
              </button>
            </div>
          )}
        </div>

        <div className="profile-stats-row">
          <div className="profile-stat-card">
            <span className="profile-stat-value wins">{profile.wins}</span>
            <span className="profile-stat-label">Victorias</span>
          </div>
          <div className="profile-stat-card">
            <span className="profile-stat-value losses">{profile.losses}</span>
            <span className="profile-stat-label">Derrotas</span>
          </div>
          <div className="profile-stat-card">
            <span className="profile-stat-value streak">
              {(profile as any).consecutiveWins ?? 0}
            </span>
            <span className="profile-stat-label">Racha</span>
          </div>
          <div className="profile-stat-card">
            <span className="profile-stat-value winrate">{getWinRate()}%</span>
            <span className="profile-stat-label">Win Rate</span>
          </div>
        </div>

        {isMe && (
          <div className="profile-section">
            <div className="profile-section-header">
              <div className="profile-section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <span className="profile-section-title">Mis vehículos</span>
              <button className="profile-add-btn" onClick={openCreateVehicle}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Agregar vehículo
              </button>
            </div>

            {vehicles.length === 0 ? (
              <div className="profile-no-vehicles">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="6" width="22" height="12" rx="2" ry="2" />
                  <circle cx="7" cy="18" r="2" />
                  <circle cx="17" cy="18" r="2" />
                </svg>
                <span className="profile-no-vehicles-text">
                  No tienes vehículos registrados
                </span>
                <button className="profile-add-btn" onClick={openCreateVehicle}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Registrar mi primer vehículo
                </button>
              </div>
            ) : (
              <div className="profile-vehicle-grid">
                {vehicles.map((v) => (
                  <div
                    key={v.id}
                    className={`profile-vehicle-card ${v.active ? "active-vehicle" : ""}`}
                  >
                    {v.photo ? (
                      <img
                        src={v.photo}
                        alt={`${v.brand} ${v.model}`}
                        className="profile-vehicle-photo"
                      />
                    ) : (
                      <div className="profile-vehicle-photo-placeholder">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="1" y="6" width="22" height="12" rx="2" ry="2" />
                          <circle cx="7" cy="18" r="2" />
                          <circle cx="17" cy="18" r="2" />
                        </svg>
                      </div>
                    )}
                    <div className="profile-vehicle-body">
                      <div className="profile-vehicle-top">
                        <span className="profile-vehicle-name">
                          {v.brand} {v.model}
                        </span>
                        {v.active && (
                          <span className="profile-vehicle-active-badge">Activo</span>
                        )}
                      </div>
                      <div className="profile-vehicle-details">
                        <span className="profile-vehicle-type-badge">
                          {v.vehicleType}
                        </span>
                        <span className="profile-vehicle-detail">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          {v.year}
                        </span>
                        <span className="profile-vehicle-detail">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                          {v.color}
                        </span>
                        {v.plate && (
                          <span className="profile-vehicle-detail">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="2" y="7" width="20" height="10" rx="2" />
                            </svg>
                            {v.plate}
                          </span>
                        )}
                      </div>
                      {v.modifications && (
                        <div className="profile-vehicle-mods">
                          🔧 {v.modifications}
                        </div>
                      )}
                      <div className="profile-vehicle-actions">
                        {!v.active && (
                          <button
                            className="pv-action-btn pv-action-btn--activate"
                            onClick={() => handleSetActive(v.id)}
                            disabled={activatingVehicleId === v.id}
                          >
                            {activatingVehicleId === v.id ? "Activando..." : "Activar"}
                          </button>
                        )}
                        <button
                          className="pv-action-btn pv-action-btn--edit"
                          onClick={() => openEditVehicle(v)}
                        >
                          Editar
                        </button>
                        <button
                          className="pv-action-btn pv-action-btn--delete"
                          onClick={() => handleDeleteVehicle(v.id)}
                          disabled={deletingVehicleId === v.id}
                        >
                          {deletingVehicleId === v.id ? "Eliminando..." : "Eliminar"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {isMe && (
          <div className="profile-section">
            <div className="profile-section-header">
              <div className="profile-section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
              </div>
              <span className="profile-section-title">Historial de retos</span>
            </div>

            {challenges.length === 0 ? (
              <div className="profile-no-challenges">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
                <span className="profile-no-challenges-text">
                  Aún no tienes retos registrados
                </span>
              </div>
            ) : (
              <div className="profile-challenges-list">
                {challenges.slice(0, 10).map((c) => (
                  <div key={c.id} className="profile-challenge-card">
                    <div className="profile-challenge-info">
                      <span className="profile-challenge-rival">
                        vs {getRivalName(c)}
                      </span>
                      <div className="profile-challenge-meta">
                        <span>{c.raceType}</span>
                        {c.agreedLocation && <span>📍 {c.agreedLocation}</span>}
                        {c.agreedDate && (
                          <span>
                            {new Date(c.agreedDate).toLocaleDateString("es-MX", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="profile-challenge-right">
                      <span className={`profile-challenge-status ${getStatusClass(c.status)}`}>
                        {getStatusLabel(c.status)}
                      </span>
                      {c.status === "completed" && c.winnerId && (
                        <span
                          className={`profile-challenge-result ${
                            c.winnerId === authUser?.id ? "won" : "lost"
                          }`}
                        >
                          {c.winnerId === authUser?.id ? "Victoria" : "Derrota"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showEditProfile && (
        <div className="p-modal-overlay" onClick={() => setShowEditProfile(false)}>
          <div className="p-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="p-modal-header">
              <span className="p-modal-title">Editar perfil</span>
              <button className="p-modal-close-btn" onClick={() => setShowEditProfile(false)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {profileError && (
              <div className="p-modal-error">{profileError}</div>
            )}

            <div className="p-modal-form">
              <div className="p-modal-field">
                <label className="p-modal-label">Username</label>
                <input
                  className="p-modal-input"
                  value={profileForm.username}
                  onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                  placeholder="Tu nombre de piloto"
                />
              </div>
              <div className="p-modal-row">
                <div className="p-modal-field">
                  <label className="p-modal-label">Localidad</label>
                  <input
                    className="p-modal-input"
                    value={profileForm.locality}
                    onChange={(e) => setProfileForm({ ...profileForm, locality: e.target.value })}
                    placeholder="Tu barrio"
                  />
                </div>
                <div className="p-modal-field">
                  <label className="p-modal-label">Ciudad</label>
                  <input
                    className="p-modal-input"
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    placeholder="Tu ciudad"
                  />
                </div>
              </div>
              <div className="p-modal-row">
                <div className="p-modal-field">
                  <label className="p-modal-label">Estado / Departamento</label>
                  <input
                    className="p-modal-input"
                    value={profileForm.state}
                    onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                    placeholder="Tu estado"
                  />
                </div>
                <div className="p-modal-field">
                  <label className="p-modal-label">País</label>
                  <input
                    className="p-modal-input"
                    value={profileForm.country}
                    onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                    placeholder="Tu país"
                  />
                </div>
              </div>
              <button
                className="p-modal-submit-btn"
                onClick={handleSaveProfile}
                disabled={profileSaving}
              >
                {profileSaving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showVehicleModal && (
        <div className="p-modal-overlay" onClick={() => setShowVehicleModal(false)}>
          <div className="p-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="p-modal-header">
              <span className="p-modal-title">
                {editingVehicle ? "Editar vehículo" : "Nuevo vehículo"}
              </span>
              <button className="p-modal-close-btn" onClick={() => setShowVehicleModal(false)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {vehicleError && (
              <div className="p-modal-error">{vehicleError}</div>
            )}

            <div className="p-modal-form">
              <div className="p-modal-field">
                <label className="p-modal-label">Tipo de vehículo</label>
                <select
                  className="p-modal-select"
                  value={vehicleForm.vehicleType}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, vehicleType: e.target.value })}
                >
                  <option value="motorcycle">Motocicleta</option>
                  <option value="car">Automóvil</option>
                </select>
              </div>
              <div className="p-modal-row">
                <div className="p-modal-field">
                  <label className="p-modal-label">Marca</label>
                  <input
                    className="p-modal-input"
                    value={vehicleForm.brand}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, brand: e.target.value })}
                    placeholder="Yamaha, Honda, BMW..."
                  />
                </div>
                <div className="p-modal-field">
                  <label className="p-modal-label">Modelo</label>
                  <input
                    className="p-modal-input"
                    value={vehicleForm.model}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                    placeholder="YZF-R3, Ninja 400..."
                  />
                </div>
              </div>
              <div className="p-modal-row">
                <div className="p-modal-field">
                  <label className="p-modal-label">Año</label>
                  <input
                    className="p-modal-input"
                    type="number"
                    value={vehicleForm.year}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, year: e.target.value })}
                    placeholder="2024"
                    min="1950"
                    max="2030"
                  />
                </div>
                <div className="p-modal-field">
                  <label className="p-modal-label">Color</label>
                  <input
                    className="p-modal-input"
                    value={vehicleForm.color}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, color: e.target.value })}
                    placeholder="Rojo, Azul..."
                  />
                </div>
              </div>
              <div className="p-modal-field">
                <label className="p-modal-label">Placa (opcional)</label>
                <input
                  className="p-modal-input"
                  value={vehicleForm.plate}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, plate: e.target.value })}
                  placeholder="ABC123"
                />
              </div>
              <div className="p-modal-field">
                <label className="p-modal-label">Foto del vehículo (URL, opcional)</label>
                <input
                  className="p-modal-input"
                  value={vehicleForm.photo}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, photo: e.target.value })}
                  placeholder="https://ejemplo.com/moto.jpg"
                />
              </div>
              <div className="p-modal-field">
                <label className="p-modal-label">Modificaciones (opcional)</label>
                <textarea
                  className="p-modal-textarea"
                  value={vehicleForm.modifications}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, modifications: e.target.value })}
                  placeholder="Escape deportivo, llantas de alto agarre..."
                  rows={3}
                />
              </div>
              {!editingVehicle && (
                <label className="p-modal-checkbox-label">
                  <input
                    type="checkbox"
                    checked={vehicleForm.active}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, active: e.target.checked })}
                    className="p-modal-checkbox"
                  />
                  Establecer como vehículo activo
                </label>
              )}
              <button
                className="p-modal-submit-btn"
                onClick={handleSaveVehicle}
                disabled={vehicleSaving}
              >
                {vehicleSaving
                  ? "Guardando..."
                  : editingVehicle
                  ? "Guardar cambios"
                  : "Registrar vehículo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
