import React, { Component, ReactNode } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { logger } from '../utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    logger.error('ErrorBoundary caught an error', 'ErrorBoundary', error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={{ flex: 1, backgroundColor: '#FFFCF9', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ marginBottom: 24 }}>
              <Ionicons name="alert-circle" size={64} color="#E11D48" />
            </View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 12, textAlign: 'center' }}>
              Ops! Algo deu errado
            </Text>
            <Text style={{ fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 24 }}>
              Encontramos um problema inesperado. Por favor, tente novamente.
            </Text>
            {__DEV__ && this.state.error && (
              <View style={{ backgroundColor: '#F3F4F6', padding: 16, borderRadius: 8, marginBottom: 24, width: '100%' }}>
                <Text style={{ fontSize: 12, color: '#EF4444', fontFamily: 'monospace' }}>
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo?.componentStack && (
                  <Text style={{ fontSize: 10, color: '#6B7280', fontFamily: 'monospace', marginTop: 8 }}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </View>
            )}
            <Pressable
              onPress={this.handleReset}
              style={{
                backgroundColor: '#E11D48',
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>Tentar novamente</Text>
            </Pressable>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

